// app/layout.tsx
'use client';

import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { BasicRoute } from '@/mock';
import NotFoundPage from './not-found';
import RootLayout from './layout';
import MainLayout from '@/components/layouts/MainLayout';
import Login from './login/page';
import SamplingPage from './sampling/page';
import SamplingEditPage from './sampling/[id]/page';

export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        errorElement: <NotFoundPage />,
        children: [
            {
                path: "",
                element: <MainLayout />,
                children: BasicRoute,
            },
            { path: "login", element: <Login /> },
            {
                path: "/sampling",
                element: <SamplingPage />,
                children: [
                    { path: ":id", element: <SamplingEditPage formName="samplingEditForm" /> },
                    // { path: ":id/dup", element: <SamplingDup formName="samplingDupForm" /> },
                ],
            }
        ],
    },
    
]);