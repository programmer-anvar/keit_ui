import { NextResponse } from 'next/server';

export async function checkServices(req) {
    const { pathname } = req.nextUrl;
    const slug = pathname.split('/')[2];

    const serviceData = JSON.parse(req.cookies.get('serviceData') || '[]');

    const slugExists = serviceData.some((service) =>
        service.subServices?.some((subService) => subService.slug.slice(1) === slug)
    );

    if (!slugExists) {
        return NextResponse.rewrite(new URL('/not-found', req.url));
    }

    return NextResponse.next();
}
