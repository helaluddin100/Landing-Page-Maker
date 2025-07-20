import HeroSection from './sections/HeroSection'
import ProductShowcase from './sections/ProductShowcase'
import TestimonialSection from './sections/TestimonialSection'
import NewsletterSection from './sections/NewsletterSection'
import ImageTextSection from './sections/ImageTextSection'
import FeatureGrid from './sections/FeatureGrid'
import CTASection from './sections/CTASection'
import ProductDetailsSection from './sections/ProductDetailsSection'
import OrderFormSection from './sections/OrderFormSection'
import SwiperSlider from './sections/SwiperSlider'

const SectionRenderer = ({ section, onUpdate, isViewMode = false }) => {
  const { type, data } = section

  const sectionComponents = {
    hero: HeroSection,
    product_showcase: ProductShowcase,
    testimonial: TestimonialSection,
    newsletter: NewsletterSection,
    image_text: ImageTextSection,
    feature_grid: FeatureGrid,
    cta: CTASection,
    product_details: ProductDetailsSection,
    order_form: OrderFormSection,
    swiper_slider: SwiperSlider
  }

  const SectionComponent = sectionComponents[type]

  if (!SectionComponent) {
    return (
      <div className="alert alert-warning">
        Unknown section type: {type}
      </div>
    )
  }

  return (
    <SectionComponent 
      data={data}
      onUpdate={onUpdate}
      isViewMode={isViewMode}
    />
  )
}

export default SectionRenderer