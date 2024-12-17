import MyContainer from "@/components/v4-material/MyContainer";
import "./ContentSeoV0.scss";
const ContentSeoV0 = ({ descriptionSEO, titleSEO }: { descriptionSEO: string; titleSEO: string }) => {
    const srcImageSeoWeb = "/images/passemall/image_seo_web.png";
    const srcImageSeoMobile = "/images/passemall/image_seo_mobile.png";
    return (
        <>
            <MyContainer className="seo-widget">
                <div className="container-content-seo">
                    <div className="text-content">
                        <div className="container-text">
                            <h1 className="title-seo">{titleSEO}</h1>
                            <p className="description-seo">{descriptionSEO}</p>
                        </div>
                    </div>

                    <div className="container-img-web">
                        <img src={srcImageSeoWeb} alt="image" />
                    </div>
                    <div className="container-img-mobile">
                        <img src={srcImageSeoMobile} alt="image" />
                    </div>
                </div>
            </MyContainer>
        </>
    );
};

export default ContentSeoV0;
