import MyContainer from "@/components/container/myContainer";
import "./ContentSeoV0.scss";
import LazyLoadImage from "@/components/images";
const ContentSeoV0 = ({
    descriptionSEO,
    titleSEO,
}: {
    descriptionSEO: string;
    titleSEO: string;
}) => {
    const srcImageSeoWeb = "/images/passemall/image_seo_web.png";
    const srcImageSeoMobile = "/images/passemall/image_seo_mobile.png";
    return (
        <MyContainer className="seo-widget">
            <div className="container-content-seo">
                <div className="text-content">
                    <div className="container-text">
                        <h1 className="title-seo">{titleSEO}</h1>
                        <p className="description-seo">{descriptionSEO}</p>
                    </div>
                </div>

                <div className="container-img-web">
                    <LazyLoadImage src={srcImageSeoWeb} alt="image" />
                </div>
                <div className="container-img-mobile">
                    <LazyLoadImage
                        classNames="w"
                        src={srcImageSeoMobile}
                        alt="image"
                    />
                </div>
            </div>
        </MyContainer>
    );
};

export default ContentSeoV0;
