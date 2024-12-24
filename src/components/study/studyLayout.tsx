import Grid2 from "@mui/material/Grid2";
import React from "react";
import ContentGroup from "./contentGroup";
import HeaderMobile from "./headerMobile";
import QuestionGroup from "./questionGroup";

const StudyLayout = ({ contentSeo }: { contentSeo: string }) => {
    return (
        <div className="flex-1 max-w-page sm:px-4 mx-auto">
            <Grid2 container>
                <Grid2
                    size={{
                        sm: 0,
                        md: 0,
                        xs: 12,
                    }}
                >
                    <HeaderMobile />
                </Grid2>
            </Grid2>
            <div className="sm:py-4" id="v4-study-main-view-0">
                <Grid2
                    container
                    spacing={{ xs: 0, sm: 2 }}
                    className="w-full h-full"
                >
                    <Grid2
                        size={{
                            sm: 3,
                            xs: 0,
                        }}
                    >
                        <QuestionGroup />
                    </Grid2>
                    <Grid2
                        size={{
                            sm: 9,
                            xs: 12,
                        }}
                    >
                        <ContentGroup contentSeo={contentSeo} />
                    </Grid2>
                </Grid2>
            </div>
        </div>
    );
};

export default React.memo(StudyLayout);
