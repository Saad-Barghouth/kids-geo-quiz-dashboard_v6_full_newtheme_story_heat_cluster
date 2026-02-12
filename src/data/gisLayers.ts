export type GisLayerType = "feature-layer" | "map-server" | "wms";

export interface GisLayerConfig {
    id: string;
    label: string;
    type: GisLayerType;
    url: string;
    layers?: string; // For WMS
    format?: string; // For WMS
    opacity?: number;
    attribution?: string;
}

export const GIS_LAYERS: GisLayerConfig[] = [
    // --- Unit 3: Treasures of Egypt (Minerals & Energy) ---
    {
        id: "egypt_minerals_overview",
        label: "توزيع المعادن في مصر (نظرة عامة)",
        type: "feature-layer",
        url: "https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/Minerals_in_Egypt/FeatureServer/0",
        attribution: "Esri Egypt"
    },
    {
        id: "mrds_mines",
        label: "مواقع المناجم (MRDS GLOBAL)",
        type: "feature-layer",
        url: "https://services.arcgis.com/V6ZHFr6zd96uCUXs/ArcGIS/rest/services/MRDS_Mines/FeatureServer/0",
        attribution: "USGS"
    },
    {
        id: "egypt_geology",
        label: "الخريطة الجيولوجية (Nubian Project)",
        type: "feature-layer",
        url: "https://www.esrs.wmich.edu/arcgis/rest/services/Nubian_project/MapServer/26",
        attribution: "WMU"
    },
    {
        id: "world_power_plants",
        label: "محطات الطاقة العالمية (مصر)",
        type: "feature-layer",
        url: "https://services.arcgis.com/P3ePLMYs2ICduZPs/ArcGIS/rest/services/World_Power_Plants/FeatureServer/0",
        attribution: "WRI"
    },

    // --- Unit 3: Water Resources ---
    {
        id: "egypt_water_bodies",
        label: "مسطحات مائية (نيل، بحيرات)",
        type: "feature-layer",
        url: "https://gis.wfp.org/arcgis/rest/services/Hosted/Egypt_Water_Bodies/FeatureServer/0",
        attribution: "WFP"
    },
    {
        id: "egypt_resource",
        label: "موارد وطرق ومناطق مأهولة",
        type: "feature-layer",
        url: "https://services1.arcgis.com/0MSEUqKaxRlEPj5g/ArcGIS/rest/services/Eygpt_Resource_Map_WFL1/FeatureServer/0",
        attribution: "Esri Egypt"
    },
    {
        id: "egypt_hydro",
        label: "هيدرولوجيا مصر",
        type: "feature-layer",
        url: "https://pro-ags2.dfs.un.org/arcgis/rest/services/hosted/Hydro_Egypt/FeatureServer/0",
        attribution: "UN Hydro"
    },

    // --- Other Layers ---
    {
        id: "egypt_scrub_forest",
        label: "غطاء نباتي (غابات وشجيرات)",
        type: "feature-layer",
        url: "https://services5.arcgis.com/SaBe5HMtmnbqSWlu/ArcGIS/rest/services/Egypt_Scrub_and_Forest/FeatureServer/0",
        attribution: "Esri"
    },
    {
        id: "cairo_boundaries",
        label: "حدود محافظة القاهرة",
        type: "map-server",
        url: "https://geoportal.cairodc.gov.eg/server/rest/services/محافظة_القاهرة_بالحدود/MapServer",
        attribution: "Cairo Gov"
    },
    {
        id: "gamalya_services",
        label: "خدمات حي الجمالية",
        type: "map-server",
        url: "https://geoportal.cairodc.gov.eg/server/rest/services/خدمات_الجمالية/MapServer",
        attribution: "Cairo Gov"
    },
    {
        id: "maadi_services",
        label: "خدمات حي المعادي",
        type: "map-server",
        url: "https://geoportal.cairodc.gov.eg/server/rest/services/خدمات_حى_المعادى/MapServer",
        attribution: "Cairo Gov"
    },
    {
        id: "isric_farming",
        label: "أنظمة الزراعة (إفريقيا/مصر)",
        type: "wms",
        url: "https://africasis.isric.org/ows/farming-systems",
        layers: "farming-systems",
        format: "image/png",
        attribution: "ISRIC"
    },
    {
        id: "fao_base",
        label: "FAO Base Map",
        type: "wms",
        url: "http://data.fao.org/maps/ows",
        layers: "GEONETWORK:base_map",
        format: "image/png",
        attribution: "FAO"
    }
];
