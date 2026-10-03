import { brand } from '@/lib/brand'
import type { Metadata } from 'next'
import SuggestResourceButton from '@/components/resources/SuggestResourceButton'
import SectionTabs from '@/components/SectionTabs'
import { localTabs } from '@/lib/sections'
import {
  listingCount,
  mapsUrl,
  resourceSections,
  tel,
  type Resource,
} from '@/lib/local'

export const metadata: Metadata = {
  title: `Local Resources, ${brand.name}`,
  description: `Vets, emergency clinics, groomers, daycare, dog parks and pet-friendly spots across ${brand.regionPhrase}.`,
}

function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <div className="card p-5 hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <h3 className="font-extrabold text-plum text-base">{resource.name}</h3>
          {resource.detail && <p className="text-sm text-plum/60 mt-0.5">{resource.detail}</p>}
        </div>
        <span className={`badge text-xs flex-shrink-0 ${resource.badgeColor}`}>{resource.badge}</span>
      </div>

      {resource.address && (
        <p className="text-sm text-plum/60 mt-1.5">📍 {resource.address}</p>
      )}

      {resource.phone && (
        <p className="mt-1.5">
          <a href={`tel:${tel(resource.phone)}`} className="text-sm font-semibold text-brand-teal hover:underline">
            📞 {resource.phone}
          </a>
        </p>
      )}

      {resource.map && (
        <p className="mt-1">
          <a
            href={mapsUrl(resource.map)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-brand-teal hover:underline"
          >
            🗺️ Map & directions
          </a>
        </p>
      )}

      {resource.stars && (
        <div className="flex gap-0.5 mt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={`text-sm ${i < resource.stars! ? 'text-brand-golden' : 'text-plum/20'}`}>★</span>
          ))}
        </div>
      )}

      {resource.note && (
        <div className="mt-2 text-xs text-plum/60 bg-plum/5 rounded-lg px-3 py-2 italic">
          💬 {resource.note}
        </div>
      )}
    </div>
  )
}

export default function LocalPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
        <div>
          <h1 className="section-title">Local Resources</h1>
          <p className="text-plum/60 mt-2">
            Pet services, parks, and dog-friendly spots around {brand.regionPhrase}.
          </p>
        </div>
        <SuggestResourceButton className="btn-secondary self-start">
          + Suggest a Resource
        </SuggestResourceButton>
      </div>

      <SectionTabs tabs={localTabs} />

      {/* Jump links */}
      <div className="flex flex-wrap gap-2 mb-6">
        {resourceSections.map((section) => (
          <a
            key={section.slug}
            href={`#${section.slug}`}
            className="inline-flex items-center gap-1.5 bg-white rounded-full px-4 py-2 text-sm font-semibold text-plum shadow-sm border border-plum/10 hover:border-brand-orange hover:text-brand-orange transition-colors"
          >
            <span>{section.icon}</span> {section.title}
          </a>
        ))}
      </div>

      {/* Quick disclaimer */}
      <div className="bg-brand-golden/10 border border-brand-golden/30 rounded-xl p-4 mb-10 text-sm text-plum/70">
        <strong className="text-plum">Worth checking:</strong> Always call ahead to confirm hours, pricing, and pet policies. Things change, and we can&rsquo;t promise this list is current.
      </div>

      {/* Resource sections */}
      <div className="space-y-10">
        {resourceSections.map((section) => (
          <div key={section.title} id={section.slug} className="scroll-mt-24">
            <div className={`flex items-start gap-3 mb-5 border-l-4 ${section.color} pl-4`}>
              <span className="text-3xl flex-shrink-0 mt-0.5">{section.icon}</span>
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <h2 className={`text-xl sm:text-2xl font-extrabold ${section.titleColor}`}>{section.title}</h2>
                <span className="text-plum/40 text-sm">({listingCount(section)} listings)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.resources.map((resource) => (
                <ResourceCard key={resource.name} resource={resource} />
              ))}
            </div>

            {section.subsections?.map((sub) => (
              <div key={sub.title} className="mt-6">
                <h3 className="font-extrabold text-plum text-lg mb-3 pl-4">{sub.title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sub.resources.map((resource) => (
                    <ResourceCard key={resource.name} resource={resource} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Submit CTA */}
      <div className="mt-16 bg-plum rounded-3xl p-6 sm:p-10 text-center text-white">
        <div className="text-4xl mb-4">🗺️</div>
        <h2 className="text-2xl font-extrabold mb-3">Know a great spot we&apos;re missing?</h2>
        <p className="text-white/70 mb-6 max-w-lg mx-auto">
          This guide is built by the community. If you have a vet, groomer, trail, or restaurant to recommend, we want to hear about it.
        </p>
        <SuggestResourceButton className="btn-primary text-base px-8">
          Suggest a Resource
        </SuggestResourceButton>
      </div>
    </div>
  )
}
