# API routes for projects

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import uuid

from database import get_db
from models import User, Project, Cabinet, CutList
from auth import get_current_user
from usage import log_usage_event, check_limit, get_monthly_usage, get_tier_info

router = APIRouter(prefix="/api/projects", tags=["projects"])


# Request/Response models
class CabinetCreate(BaseModel):
    name: str
    width: float
    height: float
    depth: float
    material: str


class CabinetResponse(BaseModel):
    id: str
    name: str
    width: float
    height: float
    depth: float
    material: str
    created_at: datetime

    class Config:
        from_attributes = True


class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    cabinets: List[CabinetCreate] = []


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class ProjectResponse(BaseModel):
    id: str
    name: str
    description: Optional[str]
    cabinets: List[CabinetResponse] = []
    created_at: datetime

    class Config:
        from_attributes = True


class UsageResponse(BaseModel):
    tier: dict
    usage: dict


@router.get("", response_model=List[ProjectResponse])
async def get_projects(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all projects for the current user"""
    projects = db.query(Project).filter(
        Project.user_id == current_user.id
    ).order_by(Project.created_at.desc()).all()
    
    return [
        ProjectResponse(
            id=str(p.id),
            name=p.name,
            description=p.description,
            cabinets=[
                CabinetResponse(
                    id=str(c.id),
                    name=c.name,
                    width=float(c.width),
                    height=float(c.height),
                    depth=float(c.depth),
                    material=c.material,
                    created_at=c.created_at
                )
                for c in p.cabinets
            ],
            created_at=p.created_at
        )
        for p in projects
    ]


@router.post("", response_model=ProjectResponse)
async def create_project(
    project_data: ProjectCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new project"""
    # Check project limit
    limit_check = check_limit(db, current_user, "project")
    if not limit_check["allowed"]:
        raise HTTPException(
            status_code=403,
            detail=f"Project limit reached ({limit_check['limit']}). Upgrade to create more."
        )
    
    # Create project
    project = Project(
        user_id=current_user.id,
        name=project_data.name,
        description=project_data.description
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    
    # Add cabinets if provided
    for cabinet_data in project_data.cabinets:
        cabinet = Cabinet(
            project_id=project.id,
            name=cabinet_data.name,
            width=cabinet_data.width,
            height=cabinet_data.height,
            depth=cabinet_data.depth,
            material=cabinet_data.material
        )
        db.add(cabinet)
    
    db.commit()
    db.refresh(project)
    
    # Log usage
    log_usage_event(db, str(current_user.id), "create", "project")
    
    return ProjectResponse(
        id=str(project.id),
        name=project.name,
        description=project.description,
        cabinets=[
            CabinetResponse(
                id=str(c.id),
                name=c.name,
                width=float(c.width),
                height=float(c.height),
                depth=float(c.depth),
                material=c.material,
                created_at=c.created_at
            )
            for c in project.cabinets
        ],
        created_at=project.created_at
    )


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific project"""
    try:
        pid = uuid.UUID(project_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid project ID")
    
    project = db.query(Project).filter(
        Project.id == pid,
        Project.user_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return ProjectResponse(
        id=str(project.id),
        name=project.name,
        description=project.description,
        cabinets=[
            CabinetResponse(
                id=str(c.id),
                name=c.name,
                width=float(c.width),
                height=float(c.height),
                depth=float(c.depth),
                material=c.material,
                created_at=c.created_at
            )
            for c in project.cabinets
        ],
        created_at=project.created_at
    )


@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: str,
    project_data: ProjectUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a project"""
    try:
        pid = uuid.UUID(project_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid project ID")
    
    project = db.query(Project).filter(
        Project.id == pid,
        Project.user_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if project_data.name is not None:
        project.name = project_data.name
    if project_data.description is not None:
        project.description = project_data.description
    
    db.commit()
    db.refresh(project)
    
    return ProjectResponse(
        id=str(project.id),
        name=project.name,
        description=project.description,
        cabinets=[
            CabinetResponse(
                id=str(c.id),
                name=c.name,
                width=float(c.width),
                height=float(c.height),
                depth=float(c.depth),
                material=c.material,
                created_at=c.created_at
            )
            for c in project.cabinets
        ],
        created_at=project.created_at
    )


@router.delete("/{project_id}")
async def delete_project(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a project"""
    try:
        pid = uuid.UUID(project_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid project ID")
    
    project = db.query(Project).filter(
        Project.id == pid,
        Project.user_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    db.delete(project)
    db.commit()
    
    return {"message": "Project deleted"}


@router.get("/usage/me", response_model=UsageResponse)
async def get_usage(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current usage stats for the user"""
    tier_info = get_tier_info(current_user)
    usage = get_monthly_usage(db, str(current_user.id))
    
    return UsageResponse(tier=tier_info, usage=usage)
