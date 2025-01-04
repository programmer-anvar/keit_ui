export const samplingInputs = [
    {
        name: 'samplingRegNumber',
        label: '접수번호',
        type: 'STRING',
        card: 'sampling',
        rules: [
            { required: true, message: 'Please input the Sampling Reg Number!' }
        ],
    },
    {
        name: 'measurerId1',
        label: '측정자 1',
        type: 'STRING',
        card: 'sampling',
        rules: [
            { required: true, message: 'Please input the Measurer 1!' }
        ],
    },
    {
        name: 'measurerId2',
        label: '측정자 2',
        type: 'STRING',
        card: 'sampling',
        rules: [
            { required: true, message: 'Please input the Measurer 2!' }
        ],
    },
    {
        name: 'inspectionPurpose',
        label: '검사목적',
        type: 'STRING',
        card: 'sampling',
        rules: [
            { required: true, message: 'Please input the Inspection Purpose!' }
        ],
    }
]