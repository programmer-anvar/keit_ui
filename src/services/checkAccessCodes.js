export const fetchAccessCodes = async (path, serviceData) => {
    // Find the subservice based on the slug
    const foundService = serviceData.find((service) =>
        service.subServices?.some((subService) => subService.slug.slice(1) === path)
    );

    if (!foundService) {
        // If the slug doesn't exist, return no access
        return { message: "No Access", accessCodes: null };
    }

    // Find the matching subService within the found service
    const subService = foundService.subServices.find((subService) => subService.slug.slice(1) === path);

    if (!subService) {
        // If the subService doesn't exist, return no access
        return { message: "No Access", accessCodes: null };
    }

    // Extract the subService's code
    const subServiceCode = subService.code;

    // Extract the innerService codes if they exist
    const innerServiceCodes = subService.innerServicesResponses
        ? subService.innerServicesResponses.map((innerService) => innerService.code)
        : [];

    // Return both subServiceCode and innerServiceCodes
    return {
        message: "Access Granted",
        accessCodes: {
            subServiceCode,
            innerServiceCodes,
        },
    };
};
