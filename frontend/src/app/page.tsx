import { CabinetBuilder } from '@/components/CabinetBuilder'
import { ArrowRight, CheckCircle, Cpu, Zap, Shield, BarChart } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50"></div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
              Precision Cabinet Design
              <span className="block text-4xl sm:text-5xl lg:text-6xl font-light text-gray-600 mt-4">
                for Woodworkers & DIYers
              </span>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-xl text-gray-600">
              AI-powered cabinet design tool that makes professional fabrication accessible to everyone.
              Generate cut lists, optimize materials, and source hardware—all in one platform.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/register"
                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105"
              >
                Start Designing Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <a
                href="/pricing"
                className="inline-flex items-center justify-center rounded-lg border-2 border-gray-300 bg-white px-8 py-4 text-lg font-semibold text-gray-900 shadow-sm hover:bg-gray-50 transition-all duration-300"
              >
                View Pricing
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Everything You Need</h2>
          <p className="mt-4 text-lg text-gray-600">
            Professional cabinet design tools, simplified for everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Cpu,
              title: 'AI-Powered Optimization',
              description: 'Smart cut list generation that minimizes waste and maximizes material usage.',
              color: 'from-blue-500 to-cyan-500'
            },
            {
              icon: Zap,
              title: 'Real-time 3D Preview',
              description: 'Visualize your cabinet designs in 3D as you build them.',
              color: 'from-purple-500 to-pink-500'
            },
            {
              icon: Shield,
              title: 'Professional Results',
              description: 'Generate industry-standard cut lists, DXF files, and fabrication drawings.',
              color: 'from-green-500 to-emerald-500'
            },
            {
              icon: BarChart,
              title: 'Cost Optimization',
              description: 'Calculate material costs and find the most economical fabrication approach.',
              color: 'from-orange-500 to-red-500'
            },
            {
              icon: CheckCircle,
              title: 'Hardware Integration',
              description: 'Automatic hardware recommendations and sourcing for your designs.',
              color: 'from-indigo-500 to-blue-500'
            },
            {
              icon: Cpu,
              title: 'Cloud Collaboration',
              description: 'Share designs with team members or clients in real-time.',
              color: 'from-yellow-500 to-orange-500'
            }
          ].map((feature, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className={`absolute top-0 right-0 h-32 w-32 -translate-y-16 translate-x-16 bg-gradient-to-br ${feature.color} opacity-10 rounded-full`}></div>
              <div className={`inline-flex rounded-lg bg-gradient-to-br ${feature.color} p-3`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main App Section */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 lg:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Cabinet Builder</h2>
            <p className="mt-4 text-lg text-gray-300">
              Design your cabinets with our intuitive drag-and-drop interface
            </p>
          </div>
          
          <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-6 lg:p-8">
            <CabinetBuilder />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to Transform Your Cabinet Projects?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100">
              Join thousands of woodworkers and DIYers who use KerfOS to save time, reduce waste, and create professional results.
            </p>
            <div className="mt-10">
              <a
                href="/register"
                className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-lg font-semibold text-gray-900 shadow-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105"
              >
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <p className="mt-4 text-sm text-blue-200">
                No credit card required • 14-day free trial • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}