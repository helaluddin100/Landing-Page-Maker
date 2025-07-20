import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { mockApiService } from '../../services/mockApiService'
import Head from 'next/head'

// Dynamically import SectionRenderer to prevent SSR issues
const SectionRenderer = dynamic(
  () => import('../../components/SectionRenderer'),
  { ssr: false }
)

export default function ViewLandingPage() {
  const router = useRouter()
  const { slug } = router.query
  const [page, setPage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (slug) {
      loadPageBySlug(slug)
    }
  }, [slug])

  const loadPageBySlug = async (pageSlug) => {
    try {
      setLoading(true)
      setError(null)
      const pageData = await mockApiService.getPageBySlug(pageSlug)
      setPage(pageData)
    } catch (error) {
      console.error('Error loading page:', error)
      setError('Page not found')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading landing page...</p>
        </div>
      </div>
    )
  }

  if (error || !page) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <i className="bi bi-exclamation-triangle display-1 text-warning mb-3"></i>
          <h2>Page Not Found</h2>
          <p className="text-muted">The landing page you're looking for doesn't exist.</p>
          <button 
            className="btn btn-primary"
            onClick={() => router.push('/')}
          >
            Go to Page Builder
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{page.title}</title>
        <meta name="description" content={page.meta_description || page.title} />
        <meta name="keywords" content={page.meta_keywords || ''} />
        <meta property="og:title" content={page.title} />
        <meta property="og:description" content={page.meta_description || page.title} />
        <meta property="og:type" content="website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="landing-page-view">
        {page.sections && page.sections.map((section, index) => (
          <div key={section.id || index} className="view-only-section">
            <SectionRenderer 
            key={section.id || index}
            section={section}
            onUpdate={() => {}} // Read-only mode - no updates allowed
            isViewMode={true} // Pass view mode flag
            />
          </div>
        ))}
      </div>
    </>
  )
}