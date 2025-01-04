export const IlabStatusOptions = [
    { label: 'RPA접수 대기중', value: 'READY_I_LAB_INQUIRY', color: 'processing' },
    { label: 'RPA접수 성공되었음', value: 'I_LAB_INQUIRY_DONE', color: 'success' },
    { label: 'RPA접수 실패되었음', value: 'I_LAB_INQUIRY_FAIL', color: 'error' },
    { label: 'RPA채취 대기중', value: 'READY_I_LAB_SAMPLING', color: 'processing' },
    { label: 'RPA채취 성공되었음', value: 'I_LAB_SAMPLING_DONE' , color: 'success' },
    { label: 'RPA채취 실패되었음', value: 'I_LAB_SAMPLING_FAIL', color: 'error' },
    { label: '아이랩RPA 성공되었음', value: 'I_LAB_COMPLETED', color: 'success' },
];

export const EcolabStatusOptions = [
    { label: 'RPA시료채취 대기중', value: 'READY_ECO_LAB_SAMPLING', color: 'processing' },
    { label: 'RPA시료채취 성공되었음', value: 'ECO_LAB_SAMPLING_DONE', color: 'success' },
    { label: 'RPA시료채취 실패되었음', value: 'ECO_LAB_SAMPLING_FAIL', color: 'error' },
    { label: 'RPA분석 대기중', value: 'READY_ECO_LAB_ANALYSIS', color: 'processing' },
    { label: 'RPA분석 성공되었음', value: 'ECO_LAB_ANALYSIS_DONE', color: 'success' },
    { label: 'RPA분석 실패되었음', value: 'ECO_LAB_ANALYSIS_FAIL', color: 'error' },
    { label: '애코랩RPA  성공되었음', value: 'ECO_LAB_COMPLETED', color: 'success' },
];

export const SamplingStatusOptions = [
    { label: '생성되었음', value: 'CREATED', color: 'warning' },
    { label: '임시저장중', value: 'WORK_CONTINUE', color: 'processing' },
    { label: '저장되었음', value: 'WORK_FINISHED', color: 'success' },
];