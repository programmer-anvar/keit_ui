import SamplingPage from "@/app/sampling/page";
import { BasicLayout } from "../layouts";
import CommonPage from "@/app/[slug]/page";
import ConfigurationPage from "@/app/configuration/page";
import ConfigurationSlugPage from "@/app/configuration/[subslug]/page";

export const BasicRoute = [
    {
        path: "collections",
        element: <BasicLayout />,
        code: 111100,
        children: [
            {
                path: "sampling",
                element: <SamplingPage />,
                code: 111110,
            },
            {
                path: "mobile-scale",
                element: <CommonPage />,
                code: 111130,
            },
            {
                path: "thc",
                element: <CommonPage />,
                code: 111120,
            },
        ],
    },
    {
        path: "operations",
        element: <BasicLayout />,
        code: 111200,
        children: [
            {
                path: "operation",
                element: <CommonPage />,
                code: 111210,
            },
            {
                path: "operation/:id",
                element: <CommonPage />,
                code: 111210,
            },
            {
                path: "car",
                element: <CommonPage />,
                code: 111220,
            },
        ],
    },
    {
        path: "settings",
        element: <BasicLayout />,
        code: 111300,
        children: [
            {
                path: "company",
                element: <CommonPage />,
                code: 111310,
            },
            {
                path: "company/add",
                element: <CommonPage />,
                code: 111310,
            },
            {
                path: "facility",
                element: <CommonPage />,
                code: 111320,
            },
            {
                path: "pollutant",
                element: <CommonPage />,
                code: 111540,
            },
            {
                path: "equipment",
                element: <CommonPage />,
                code: 111330,
            },
        ],
    },
    {
        path: "configuration",
        element: <ConfigurationPage />,
        code: 1115000,
        children: [
            {
                path: "equipment-define",
                element: <ConfigurationSlugPage />,
                code: 111510,
            },
            {
                path: "gaseous-define",
                element: <ConfigurationSlugPage />,
                code: 111520,
            },
            {
                path: "pollutant-define",
                element: <ConfigurationSlugPage />,
                code: 111540,
            },
            {
                path: "sampling-define",
                element: <ConfigurationSlugPage />,
                code: 111570,
            },
            {
                path: "sampling-measurement",
                element: <ConfigurationSlugPage />,
                code: 111580,
            },
            {
                path: "mobileScale-define",
                element: <ConfigurationSlugPage />,
                code: 111530,
            },
            {
                path: "prevention-define",
                element: <ConfigurationSlugPage />,
                code: 111550,
            },
            {
                path: "thc-define",
                element: <ConfigurationSlugPage />,
                code: 111560,
            },
            {
                path: "sampling-result",
                element: <ConfigurationSlugPage />,
                code: 111590,
            },
        ],
    }
];
