import { Space, Tag, Tooltip } from 'antd';
import React from 'react';

export const NOTIFICATION_DURATION = 3; // seconds
export const DEFAULT_PAGE_SIZE = 10;

export const COLUMN_TYPES = {
    STRING: 'STRING',
    INTEGER: 'INTEGER',
    LONG: 'LONG',
    DOUBLE: 'DOUBLE',
    BOOLEAN: 'BOOLEAN',
    DATE: 'DATE',
    SELECTION: 'SELECTION',
    FETCH_SELECT: 'FETCH_SELECT',
};

export const MODAL_SIZES = {
    SMALL: 520,
    MEDIUM: 700,
    LARGE: 1000,
};

export const FORM_LAYOUTS = {
    labelCol: { span: 8 },
    wrapperCol: { span: 14 },
};

export const API_ENDPOINTS = {
    LOGIN: '/auth/login',
    SERVICES: '/services',
    ITEMS: '/items',
};

export const configTableColumns = [
    {
        title: "Define ID",
        dataIndex: "id",
        key: "id",
        width: 80,
        fixed: 'left',
        sorter: true
    },
    {
        title: "Show Name",
        dataIndex: "showName",
        key: "showName",
        width: 400,
        sorter: true
    },
    { 
        title: "Name", 
        dataIndex: "name", 
        key: "name",
        width: 400,
        sorter: true
    },
    { 
        title: "Type", 
        dataIndex: "columnType", 
        key: "columnType",
        width: 200,
    },
    { 
        title: "Order", 
        dataIndex: "columnOrder", 
        key: "columnOrder",
        width: 100,
        sorter: true
    }
];

export const MatrixTableColumns = [
    {
        title: '시료채취시간(min)',
        dataIndex: 'sampleTime',
        width: 120,
    },
    {
        title: '진공압(inchHg)',
        dataIndex: 'vacuumPressure',
        width: 120,
    },
    {
        title: '진공게이지압력(mmHg)',
        dataIndex: 'vacuumGaugePressure',
        width: 150,
    },
    {
        title: '배출가스온도(℃)',
        dataIndex: 'exhaustTemp',
        width: 120,
    },
    {
        title: '배출가스습압(mmH2O)',
        dataIndex: 'exhaustWetPressure',
        width: 150,
    },
    {
        title: '배출가스정압(mmH2O)',
        dataIndex: 'exhaustStaticPressure',
        width: 150,
    },
    {
        title: 'K factor',
        dataIndex: 'kFactor',
        width: 100,
    },
    {
        title: '오리피스압(mmH2O)',
        dataIndex: 'orificePress',
        width: 150,
    },
    {
        title: '시작값(m³)',
        dataIndex: 'startValue',
        width: 120,
    },
    {
        title: '시작후(m³)',
        dataIndex: 'endValue',
        width: 120,
    },
    {
        title: '(L)',
        dataIndex: 'literValue',
        width: 80,
    },
    {
        title: '압구',
        dataIndex: 'pressure',
        width: 80,
    },
    {
        title: '건식가스미터온도(℃)',
        dataIndex: 'dryGasMeterTemp',
        width: 150,
    },
    {
        title: '흡구',
        dataIndex: 'suction',
        width: 80,
    },
    {
        title: '여과지접근온도(℃)',
        dataIndex: 'filterTemp',
        width: 150,
    },
    {
        title: '최종접근직후 구온도(℃)',
        dataIndex: 'finalTemp',
        width: 150,
    },
    {
        title: '측정구높이(m)',
        dataIndex: 'measureHeight',
        width: 120,
    },
    {
        title: '측정구포위(m)',
        dataIndex: 'measureCircum',
        width: 120,
    },
    {
        title: 'W (m/s)',
        dataIndex: 'velocity',
        width: 100,
    },
    {
        title: 'H (㎏)',
        dataIndex: 'weight',
        width: 100,
    }
]

export const CompanyTableColumns = [
    {
        title: '상품코드',
        dataIndex: 'companyId',
        name: 'companyId',
        width: 100,
    },
    {
        title: '상품명',
        dataIndex: 'name',
        name: 'name',
        type: 'STRING',
        width: 100,
        isRequired: true,
        isCreateRequired: true,
        sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
        title: '상품구분',
        dataIndex: 'shortname',
        name: 'shortname',
        type: 'STRING',
        isRequired: true,
        width: 100,
        isCreateRequired: true,
        sorter: (a, b) => a.shortname.localeCompare(b.shortname),
    },
    {
        title: '상품수량',
        dataIndex: 'agency_reg_number',
        name: 'agency_reg_number',
        type: 'STRING',
        isCreateRequired: true,
        width: 100,
    },
    {
        title: '상품단가',
        dataIndex: 'phone_1',
        name: 'phone_1',
        type: 'STRING',
        isCreateRequired: true,
        width: 100,
    },
    {
        title: '상품총액',
        dataIndex: 'phone_2',
        name: 'phone_2',
        type: 'STRING',
        isCreateRequired: true,
        width: 100,
    },
    {
        title: '상품가격',
        dataIndex: 'fax',
        name: 'fax',
        type: 'STRING',
        isCreateRequired: true,
        width: 100,
    },
    {
        title: '상품구분',
        dataIndex: 'website',
        name: 'website',
        type: 'STRING',
        isCreateRequired: true,
        width: 100,
    },
    {
        title: '상품구분',
        dataIndex: 'email',
        name: 'email',
        type: 'STRING',
        isCreateRequired: true,
        width: 100,
    },
    {
        title: '상품구분',
        dataIndex: 'address',
        name: 'address',
        type: 'STRING',
        isCreateRequired: true,
        width: 100,
    },
    {
        title: '상품구분',
        dataIndex: 'sub_address',
        name: 'sub_address',
        type: 'STRING',
        isCreateRequired: true,
        width: 100,
    },
    {
        title: '상품구분',
        dataIndex: 'latitude',
        name: 'latitude',
        type: 'INTEGER',
        isCreateRequired: true,
        width: 100,
    },
    {
        title: '상품구분',
        dataIndex: 'longitude',
        name: 'longitude',
        type: 'INTEGER',
        isCreateRequired: true,
        width: 100,
    },
    {
        title: '상품구분',
        dataIndex: 'country',
        name: 'country',
        type: 'STRING',
        isCreateRequired: true,
        width: 100,
    },
    {
        title: '상품구분',
        dataIndex: 'logo_url',
        name: 'logo_url',
        type: 'STRING',
        isCreateRequired: true,
        width: 100,
    },
    {
        title: '상품구분',
        dataIndex: 'agency_memo',
        name: 'agency_memo',
        type: 'TEXT',
        isCreateRequired: true,
        width: 100,
    },
]

export const StuffTableColumns = [
    {
        title: '상품코드',
        dataIndex: 'stuffId',
        name: 'stuffId',
        width: 50,
        sorter: (a, b) => a.stuffId.localeCompare(b.stuffId),
    },
    {
        title: '상품명',
        dataIndex: 'full_name',
        name: 'full_name',
        type: 'STRING',
        width: 100,
        isRequired: true,
        isCreateRequired: true,
        sorter: (a, b) => a.full_name.localeCompare(b.full_name),
    },
    {
        title: '상품구분',
        dataIndex: 'position',
        name: 'position',
        type: 'STRING',
        isRequired: true,
        width: 100,
        isCreateRequired: true,
    },
    {
        title: '상품수량',
        dataIndex: 'responsibility',
        name: 'responsibility',
        type: 'STRING',
        isCreateRequired: true,
        width: 100,
    },
    {
        title: '상품단가',
        dataIndex: 'tel',
        name: 'tel',
        type: 'STRING',
        isCreateRequired: true,
        width: 100,
    },
    {
        title: '상품총액',
        dataIndex: 'fax',
        name: 'fax',
        type: 'STRING',
        isCreateRequired: true,
        width: 100,
    },
    {
        title: '상품가격',
        dataIndex: 'email',
        name: 'email',
        type: 'STRING',
        isCreateRequired: true,
        width: 100,
    },
]

export const EnumColumns = [
    {
        title: "ID",
        dataIndex: "id",
        name: "id",
        width: 80,
        fixed: 'left',
        sorter: true
    },
    {
        title: "Show Name",
        dataIndex: "showName",
        name: "showName",
        width: 200,
        sorter: true
    },
    {
        title: "Type Name",
        dataIndex: "typeName",
        name: "typeName",
        width: 200,
        sorter: true
    },
    {
        title: "List Show Names",
        dataIndex: "listNames",
        name: "listNames",
    },
    {
        title: "Value Show Names",
        dataIndex: "values",
        name: "values",
    }
];

export const FetchSelectColumns = [
    {
        title: "Fetch selectID",
        dataIndex: "id",
        name: "id",
        width: 30,
        sorter: (a, b) => a.id - b.id
    },
    {
        title: "Fetch Name",
        dataIndex: "userDefinedColumn",
        name: "userDefinedColumn",
        width: 200
    },
    {
        title: "Table Name",
        dataIndex: ["mappedTables", "mappedDefineTableShow"],
        name: "tableName",
        width: 100
    },
    {
        title: "Mapped Columns",
        dataIndex: ["mappedTables", "selectColumns"],
        name: "mappedColumns",
        width: 300,
        render: (columns) => {
            if (!columns?.length) return null;
            
            const visibleColumns = columns.slice(0, 2).map(col => col.mappedColumnShow);
            
            return (
                <Space size={[0, 8]} wrap>
                    {visibleColumns.map((col, index) => (
                        <Tag key={index} color="blue">{col}</Tag>
                    ))}
                </Space>
            );
        }
    },
    {
        title: "Filtering Column",
        dataIndex: "filteringColumn",
        name: "filteringColumn",
        width: 100
    },
    {
        title: "Filtering Type",
        dataIndex: "filteringType",
        name: "filteringType",
        width: 100
    },
    {
        title: "Order By Column",
        dataIndex: "orderBy",
        name: "orderBy",
        width: 100
    },
    {
        title: "Order By Type",
        dataIndex: "orderingType",
        name: "orderingType",
        width: 100
    },
    // {
    //     title: "Table Code",
    //     dataIndex: "tableCode",
    //     name: "tableCode",
    //     width: 100
    // }
]

export const UnitTypes = [
    {
        value: 'TON_HR',
        label: 'ton/hr'
    },
    {
        value: 'M3',
        label: 'm³'
    },
    {
        value: 'HP',
        label: 'HP'
    },
    {
        value: 'KW',
        label: 'kW'
    },
    {
        value: 'L_HR',
        label: 'L/hr'
    },
    {
        value: 'KG_HR',
        label: 'kg/hr'
    },
    {
        value: 'M3_MIN',
        label: 'm³/min'
    },
    {
        value: 'KCAL_HR',
        label: 'kcal/hr'
    },
    {
        value: 'TON_HR_ETC',
        label: 'ton/hr 외'
    },
    {
        value: 'M3_ETC',
        label: 'm³ 외'
    },
    {
        value: 'HP_ETC',
        label: 'HP 외'
    },
    {
        value: 'KW_ETC',
        label: 'kW 외'
    },
    {
        value: 'KG_HR_ETC',
        label: 'kg/hr 외'
    },
    {
        value: 'M3_MIN_ETC',
        label: 'm³/min 외'
    },
    {
        value: 'KCAL_HR_ETC',
        label: 'kcal/hr 외'
    },
    {
        value: 'MCAL_HR_ETC',
        label: 'Mcal/hr 외'
    },
    {
        value: 'TON',
        label: '톤'
    },
]