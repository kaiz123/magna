import React from "react";
import Typed from 'react-typed';
import {NavBarWithButtonsContainer} from "../Layout/NavBar/NavBarWithButtons/NavBarWithButtonsContainer";
import 'react-toastify/dist/ReactToastify.css';
import {Button, Col, Container, Jumbotron, Row} from 'reactstrap';
import {FeatureCard} from "../Common/FeatureCard/FeatureCard";
import {LargeFeatureCard} from "../Common/LargeFeatureCard/LargeFeatureCard";
import Flickity from 'react-flickity-component';
import {COLLEGE_IMAGES, FEATURE_CARD_ELEMENTS, LARGE_FEATURE_CARD_ELEMENTS, RECOGNITIONS, TESTIMONIALS} from './data'
import {ContactUsContainer} from '../ContactUs/ContactUsForm/ContactUsContainer'
import {Footer} from '../Layout/Footer/Footer'

//
//
function typedString() {
    /**
     * Returns the string in a type format , using typedjs
     *
     */
    return (
        <Typed
            strings={
                ['Here you  can find anything',
                    "This is awesome",
                    "brilliant"]
            }
            typeSpeed={40}
            loop={true}
        />
    );
}


const bodyStyle = {
    background: 'radial-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.9)) ,url(/img/landing-1.jpg) no-repeat center',
    backgroundSize: "100% auto",
};

const flickityOptions = {
    initialIndex: 2,
    autoPlay: true,
    wrapAround: true,
};


function HomePage() {
    return (

        <div>

            <NavBarWithButtonsContainer/>


            <div>

                <Jumbotron fluid style={bodyStyle}>
                    <Container fluid>

                        <div className='text-center' style={{marginTop: "25%"}}>

                            <h2 className="text-light display-4">
                                {typedString()}
                            </h2>

                            <Container>
                                <Button color="primary" style={{marginTop: "10%"}}> View </Button>
                            </Container>

                        </div>

                    </Container>

                </Jumbotron>
                <div className="container-fluid no-gutters">
                    <div className="row justify-content-center">

                        {
                            FEATURE_CARD_ELEMENTS.map((feature_card) => {
                                return (
                                    <FeatureCard
                                        icon={feature_card.icon}
                                        text={feature_card.text}
                                    />

                                );
                            })
                        }
                    </div>
                </div>

                <Container fluid className='bg-light border-top' style={{paddingBottom: '2%'}}>

                    <h1 className="text-center" style={{paddingTop: '2%'}}> Our Features</h1>

                    <div className="container-fluid no-gutters">
                        <div className="row justify-content-center">

                            {
                                LARGE_FEATURE_CARD_ELEMENTS.map((feature_card) => {
                                    return (
                                        <LargeFeatureCard
                                            icon={feature_card.icon}
                                            text={feature_card.text}
                                        />

                                    );
                                })
                            }
                        </div>
                    </div>
                </Container>

            </div>
            <div style={{paddingTop: '60px', paddingBottom: '60px'}}>
                <span style={{
                    fontFamily: 'Open Sans,Helvetica,Arial,sans-serif',
                    textAlign: 'center',
                    display: 'block',
                    paddingBottom: '32px',
                    fontSize: '32px'
                }}>STUDENT PARTNERS</span>
                <Flickity
                    className={'carousel'} // default ''
                    elementType={'div'} // default 'div'
                    options={flickityOptions} // takes flickity options {}
                    disableImagesLoaded={false} // default false
                    reloadOnUpdate // default false
                >
                    {
                        COLLEGE_IMAGES.map((image) => {
                            return (
                                <img src={image.img} style={{width: 180, marginRight: 200}}/>

                            );
                        })
                    }
                </Flickity>
            </div>
            <div style={{paddingTop: '60px', paddingBottom: '60px', backgroundColor: 'black', color: 'white'}}>
                <Flickity
                    className={'carousel'} // default ''
                    elementType={'div'} // default 'div'
                    options={flickityOptions} // takes flickity options {}
                    disableImagesLoaded={false} // default false
                    reloadOnUpdate // default false
                >
                    {
                        TESTIMONIALS.map((testimonial) => {
                            return (
                                <div style={{display: 'flex', flexWrap: 'wrap', marginRight: 200, width: '80vw'}}>
                                    <img src={testimonial.img} style={{height: 100, marginRight: 60}}/>
                                    <div style={{display: 'flex', flexDirection: 'column'}}>
                                        <span className="h3" style={{width: '50vw'}}>{testimonial.message}</span>
                                        <h5>{testimonial.name}</h5>
                                        <span>{testimonial.place}</span>
                                    </div>
                                </div>
                            );
                        })
                    }
                </Flickity>
            </div>

            <div style={{paddingTop: '60px', paddingBottom: '60px'}}>
                <span
                    style={{fontFamily: 'Open Sans,Helvetica,Arial,sans-serif', textAlign: 'center', display: 'block', paddingBottom: '32px', fontSize: '32px'}}>RECOGNITIONS</span>
                <Flickity
                    className={'carousel'} // default ''
                    elementType={'div'} // default 'div'
                    options={flickityOptions} // takes flickity options {}
                    disableImagesLoaded={false} // default false
                    reloadOnUpdate // default false
                >
                    {
                        RECOGNITIONS.map((image) => {
                            return (
                                <img src={image.img} style={{width: 180, marginRight: 200}}/>

                            );
                        })
                    }
                </Flickity>
            </div>
            <Container style={{paddingTop: 32}}>
                <span style={{fontFamily: 'Open Sans,Helvetica,Arial,sans-serif', textAlign: 'center', display: 'block', fontSize: '32px', paddingBottom: 16}}>CONTACT US</span>
                <Row>
                    <Col style={{paddingRight: '6%'}}>
                        <p><span style={{fontSize: 20, color: 'gray', display: 'inline'}}>Email:</span><a href="mailto:hello@beatest.in"><span
                            style={{fontSize: 20, display: 'inline', textDecoration: 'underline'}}>hello@beatest.in</span></a></p>
                        <p style={{fontSize: 24, color: 'gray'}}><span>#7th Floor, Monibhandar Building Webel Bhavan Premises, Sector 5, Ring Road, Bidhannagar, West Bengal-700091, India</span>
                        </p>
                        <p style={{fontSize: 14, color: '#666'}}>
                            <span>Drop us an email or visit us anytime, we endeavour to answer all enquiries within 24 hours on business days.</span></p>
                    </Col>
                    <Col>
                        <ContactUsContainer/>
                    </Col>
                </Row>

            </Container>
            <Footer/>
        </div>
    )
}


export {HomePage};


