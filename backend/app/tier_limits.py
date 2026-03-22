# Tier limits configuration for KerfOS

TIER_LIMITS = {
    'free': {
        'projects': 5,
        'cut_lists_per_month': 10,
        'exports_per_month': 5,
        'features': ['basic_cut_list', 'csv_export', 'pdf_watermarked']
    },
    'maker': {
        'projects': -1,  # Unlimited
        'cut_lists_per_month': -1,
        'exports_per_month': -1,
        'features': ['basic_cut_list', 'advanced_nesting', 'pdf', 'dxf', 'csv', 'hardware_finder']
    },
    'shop': {
        'projects': -1,
        'cut_lists_per_month': -1,
        'exports_per_month': -1,
        'features': ['basic_cut_list', 'advanced_nesting', 'pdf', 'dxf', 'csv', 'hardware_finder', 'api_access', 'team', 'priority_support']
    },
    'pro': {
        'projects': -1,
        'cut_lists_per_month': -1,
        'exports_per_month': -1,
        'features': ['basic_cut_list', 'advanced_nesting', 'pdf', 'dxf', 'csv', 'hardware_finder', 'api_access', 'team', 'priority_support', 'white_label', 'custom_materials']
    }
}

def get_tier_limit(tier: str, resource: str) -> int:
    """Get the limit for a specific resource in a tier"""
    tier_config = TIER_LIMITS.get(tier, TIER_LIMITS['free'])
    return tier_config.get(resource, 0)

def has_feature(tier: str, feature: str) -> bool:
    """Check if a tier has access to a specific feature"""
    tier_config = TIER_LIMITS.get(tier, TIER_LIMITS['free'])
    return feature in tier_config.get('features', [])

def get_tier_features(tier: str) -> list:
    """Get all features available in a tier"""
    tier_config = TIER_LIMITS.get(tier, TIER_LIMITS['free'])
    return tier_config.get('features', [])
