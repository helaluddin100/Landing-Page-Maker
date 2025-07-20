import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import EditableText from '../EditableText'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'

const SwiperSlider = ({ data, onUpdate }) => {
  const slides = data.slides || [
    {
      id: 1,
      title: 'Premium Quality Products',
      subtitle: 'Discover our exclusive collection',
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
      buttonText: 'Shop Now'
    },
    {
      id: 2,
      title: 'Fast & Free Shipping',
      subtitle: 'Get your orders delivered quickly',
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
      buttonText: 'Learn More'
    },
    {
      id: 3,
      title: '24/7 Customer Support',
      subtitle: 'We are here to help you anytime',
      image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
      buttonText: 'Contact Us'
    }
  ]

  return (
    <section className="py-0">
      <Container fluid className="px-0">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          spaceBetween={0}
          slidesPerView={1}
          navigation={{
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom',
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          effect="fade"
          fadeEffect={{
            crossFade: true
          }}
          loop={true}
          className="hero-swiper"
          style={{ height: '500px' }}
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={slide.id}>
              <div 
                className="position-relative h-100 d-flex align-items-center"
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${slide.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  minHeight: '500px'
                }}
              >
                <Container>
                  <Row>
                    <Col lg={8} xl={6}>
                      <div className="text-white">
                        <EditableText
                          tag="h1"
                          className="display-4 fw-bold mb-3"
                          value={slide.title}
                          onChange={(title) => {
                            const newSlides = [...slides]
                            newSlides[index] = { ...newSlides[index], title }
                            onUpdate({ slides: newSlides })
                          }}
                          placeholder="Enter slide title..."
                        />
                        
                        <EditableText
                          tag="p"
                          className="lead mb-4"
                          value={slide.subtitle}
                          onChange={(subtitle) => {
                            const newSlides = [...slides]
                            newSlides[index] = { ...newSlides[index], subtitle }
                            onUpdate({ slides: newSlides })
                          }}
                          placeholder="Enter slide subtitle..."
                        />
                        
                        <Button variant="primary" size="lg" className="px-4 py-3">
                          <EditableText
                            tag="span"
                            value={slide.buttonText}
                            onChange={(buttonText) => {
                              const newSlides = [...slides]
                              newSlides[index] = { ...newSlides[index], buttonText }
                              onUpdate({ slides: newSlides })
                            }}
                            placeholder="Button Text"
                          />
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Container>
              </div>
            </SwiperSlide>
          ))}
          
          {/* Custom Navigation Buttons */}
          <div className="swiper-button-prev-custom position-absolute start-0 top-50 translate-middle-y ms-3 bg-white bg-opacity-75 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px', zIndex: 10, cursor: 'pointer' }}>
            <i className="bi bi-chevron-left text-dark fs-4"></i>
          </div>
          <div className="swiper-button-next-custom position-absolute end-0 top-50 translate-middle-y me-3 bg-white bg-opacity-75 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px', zIndex: 10, cursor: 'pointer' }}>
            <i className="bi bi-chevron-right text-dark fs-4"></i>
          </div>
        </Swiper>
      </Container>
    </section>
  )
}

export default SwiperSlider