import dynamic from 'next/dynamic';

// Dynamically import page components
const SamplingPage = dynamic(() => import('@/app/sampling/page'), { ssr: false });
const SamplingEditPage = dynamic(() => import('@/app/sampling/[id]/page'), { ssr: false });
const CommonPage = dynamic(() => import('@/app/[slug]/page'), { ssr: false });
const CompanyPage = dynamic(() => import('@/app/company/page'), { ssr: false });
const CompanyIdPage = dynamic(() => import('@/app/company/[id]/page'), { ssr: false });
const EmployeesPage = dynamic(() => import('@/app/employee/page'), { ssr: false });
const RoleAndPermissionsPage = dynamic(() => import('@/app/roles/page'), { ssr: false });
const EnumDefinePage = dynamic(() => import('@/app/configuration/enum-define/page'), { ssr: false });
const EnumCreatePage = dynamic(() => import('@/app/configuration/enum-define/create/page'), { ssr: false });
const EnumEditPage = dynamic(() => import('@/app/configuration/enum-define/[id]/page'), { ssr: false });
const FetchDefinePage = dynamic(() => import('@/app/configuration/fetch-define/page'), { ssr: false });
const FetchDefineCreatePage = dynamic(() => import('@/app/configuration/fetch-define/create/page'), { ssr: false });
const FetchDefineEditPage = dynamic(() => import('@/app/configuration/fetch-define/[id]/page'), { ssr: false });
const ConfigurationSlugPage = dynamic(() => import('@/app/configuration/[subslug]/page'), { ssr: false });
const MatrixDefinePage = dynamic(() => import('@/app/configuration/matrix-define/page'), { ssr: false });

import {
	CarOutlined,
	DesktopOutlined,
	SettingOutlined,
	TeamOutlined,
	UserOutlined,
} from "@ant-design/icons";
import PermissionAssignPage from '@/app/roles/[id]/page';
import FacilityPage from '@/app/facility/page';
import FacilityEditPage from '@/app/facility/[id]/page';

const SiteMap = [
	{
		icon: <DesktopOutlined />,
		label: "채취정보",
		serviceName: "Sampling",
		code: 111100,
		children: [
			{
				key: "/sampling",
				label: "채취정보",
				code: 111110,
				element: <SamplingPage />,
				children: [
					{
						serviceName: "update",
						key: "/sampling/:id",
						label: "채취정보",
						code: 111122,
						element: <SamplingEditPage />
					},
				],
			},
			{
				key: "/mobile-scale",
				label: "이동식저울",
				code: 111130,
				element: <CommonPage />
			},
			{
				key: "/thc",
				label: "THC",
				code: 111120,
				element: <CommonPage />
			},
		],
	},
	{
		icon: <CarOutlined />,
		label: "차량운행",
		serviceName: "Operation",
    	code: 111200,
		children: [
			{
				key: "/operation",
				label: "차량운행",
				code: 111210,
				element: <CommonPage />
			},
			{
				key: "/car",
				label: "차량",
				code: 111220,
				element: <CommonPage />
			},
		],
	},
	{
		icon: <SettingOutlined />,
		label: "설정",
		serviceName: "Setting",
		code: 111300,
		children: [
			{
				key: "/company",
				label: "사업장",
				code: 111310,
				element: <CompanyPage />,
				children: [
					{
						serviceName: "update",
						key: "/company/:id",
						label: "사업장",
						code: 111322,
						element: <CompanyIdPage />
					},
				],
			},
			{
				key: "/facility",
				label: "시설",
				serviceName: "Facility",
				code: 111320,
				element: <FacilityPage />,
				children: [
					{
						serviceName: "update",
						key: "/facility/:id",
						label: "시설",
						code: 111322,
						element: <FacilityEditPage />
					},
				]
			},
			{
				key: "/equipment",
				label: "기관",
				serviceName: "Equipment",
				code: 111330,
				element: <CommonPage />
			},
		],
	},
	{
		icon: <TeamOutlined />,
		label: "Management",
		serviceName: "Management",
		code: 1111400,
		children: [
			{
				key: "/employee",
				label: "사용자",
				serviceName: "Employee",
				code: 111410,
				element: <EmployeesPage />
			},
			{
				key: '/roles',
				label: 'Roles',
				serviceName: 'Roles',
				code: 111420,
				element: <RoleAndPermissionsPage />,
				children: [
					{
						serviceName: "update",
						key: "/roles/:id",
						label: "Roles",
						code: 111422,
						element: <PermissionAssignPage />
					},
				]
			}
		],
	},
	{
		icon: <UserOutlined />,
		label: "Configuration",
		serviceName: "Configuration",
		code: 1115000,
		children: [
			{
				key: "/configuration/enum-define",
				label: "Enum Define",
				serviceName: "Enum Define",
				code: 0.1115,
				element: <EnumDefinePage />,
				children: [
					{
						serviceName: "create",
						key: "/configuration/enum-define/create",
						label: "Enum Define Create",
						code: 0.111501,
						element: <EnumCreatePage />
					},
					{
						serviceName: "update",
						key: "/configuration/enum-define/:id",
						label: "Enum Define Update",
						code: 0.111503,
						element: <EnumEditPage />
					},
				],
			},
			{
				key: "/configuration/fetch-define",
				label: "Fetch Define",
				serviceName: "Fetch Define",
				code: 0.11151,
				element: <FetchDefinePage />,
				children: [
					{
						serviceName: "create",
						key: "/configuration/fetch-define/create",
						label: "Fetch Define Create",
						code: 0.111511,
						element: <FetchDefineCreatePage />
					},
					{
						serviceName: "update",
						key: "/configuration/fetch-define/:id",
						label: "Fetch Define Update",
						code: 0.111513,
						element: <FetchDefineEditPage />
					},
				],
			},
			{
				key: "/configuration/sampling-define",
				label: "Sampling Define",
				serviceName: "Sampling Define",
				code: 111570,
				element: <ConfigurationSlugPage path="sampling" />,
			},
			{
				key: "/configuration/equipment-define",
				label: "Equipment Define",
				serviceName: "Equipment Define",
				code: 111510,
				element: <ConfigurationSlugPage path="equipment" />,
			},
			{
				key: "/configuration/gaseous-define",
				label: "Gaseous Define",
				serviceName: "Gaseous Define",
				code: 111520,
				element: <ConfigurationSlugPage path="gaseous" />,
			},
			{
				key: "/configuration/pollutant-define",
				label: "Pollutant Define",
				serviceName: "Pollutant Define",
				code: 111540,
				element: <ConfigurationSlugPage path="pollutant" />,
			},
			{
				key: "/configuration/sampling-measurement",
				label: "Sampling Measurement",
				serviceName: "Sampling Measurement",
				code: 111580,
				element: <ConfigurationSlugPage path="sampling-measurement" />,
			},
			{
				key: "/configuration/sampling-result",
				label: "Sampling Result",
				serviceName: "Sampling Result",
				code: 111590,
				element: <ConfigurationSlugPage path="sampling-result" />,
			},
			{
				key: "/configuration/matrix-define",
				label: "Sampling Matrix Define",
				serviceName: "Sampling Matrix Define",
				code: 0.11159,
				element: <MatrixDefinePage />
			},
			{
				key: "/configuration/mobile-scale-define",
				label: "Mobile Scale Define",
				serviceName: "Mobile Scale Define",
				code: 111530,
				element: <ConfigurationSlugPage path="mobile-scale" />,
			},
			{
				key: "/configuration/thc-define",
				label: "THC Define",
				serviceName: "THC Define",
				code: 111560,
				element: <ConfigurationSlugPage path="thc" />,
			},
			{
				key: "/configuration/prevention-define",
				label: "Prevention Define",
				serviceName: "Prevention Define",
				code: 111550,
				element: <ConfigurationSlugPage path="prevention" />,
			},
			{
				key: "/configuration/facility-define",
				label: "Facility Define",
				serviceName: "Facility Define",
				code: 0.11152,
				element: <ConfigurationSlugPage path="facility" />,
			},
			{
				key: "/configuration/emission-define",
				label: "Emission Define",
				serviceName: "Emission Define",
				code: 0.11153,
				element: <ConfigurationSlugPage path="emission" />,
			}
		]
	}
];

export default SiteMap;