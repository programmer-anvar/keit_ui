// Libraries
import {
	Anchor,
	Button,
	Card,
	Col,
	Collapse,
	Divider,
	Flex,
	Form,
	Input,
	InputNumber,
	Modal,
	notification,
	Popconfirm,
	Row,
	Select,
	Space,
	Spin,
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

// Files
import useKNotification from "../../../hooks/useKNotification";
import EntityInfo from "../../../components/extra/EntityInfo";
import { getItem } from "../../../utils/persistance-storage";
import SamplingService from "../../../app/services/SamplingService";

import SamplingCompanyInfo from "./SamplingCompanyInfo";

import Gaseous from "./gaseous/Gaseous";

import ParticulateTable from "./particulate/ParticulateTable";

import {
	RadioState,
	SelectFacility,
	SelectInspection,
	SelectMeaMethod,
	SelectProcess,
	SelectSmoke,
	SelectTeamType,
	SelectUser,
	SelectWeather,
	SelectWindDirection,
} from "../../../components/search-items";
import { KInputNum, KTimePicker, KDatePicker } from "../../../components/form";
import roundTo from "../../../utils/roundTo";
import { SamplingCalc } from "./SamplingCalc";
import ParticulateResult from "./particulate/ParticulateResult";
import SamplingMemo from "./SamplingMemo";
import OptimaTime from "./sampling-forms/OptimaTime";
import GaseousService from "../../../app/services/GaseousService";
import { handlePdf } from "../../../components/pdf/HandlePdfClick";
import SamplingReport from "../../../components/pdf/SamplingReport";
import { pdf } from "@react-pdf/renderer";
import { QuestionCircleOutlined } from "@ant-design/icons";

const { Item, useForm } = Form;
const { Compact } = Space;
const { TextArea } = Input;

const SamplingEdit = () => {
	const navigator = useNavigate();

	const { id } = useParams();
	const [form] = useForm();
	const [loading, setLoading] = useState(false);

	const [extraInfo, setExtraInfo] = useState();
	const [formula, setFormula] = useState({
		facilityEfficiencyText: "",
		moistureAmountText: "",
		emsGasDensityText: "",
		emsGasFlowSpeedText: "",
		emsGasAmountText: "",
		stdOxygenEqvAmountText: "",
		dustGasAmountText: "",
		suctionCoefficientText: "",
		emsGasDryingWeightText: "",
		emsGasSpecificWeightText: "",
		kfactorAvgText: "",
		totalAmountWaterText: "",
	});

	const [facilityData, setFacilityData] = useState({
		score: 1,
		unitArea: 0,
		preventionVolume: 0,
	});

	const [measurer1, setMeasurer1] = useState([]);
	const [measurer2, setMeasurer2] = useState([]);
	const [facility, setFacility] = useState([]);
	const [facilityId, setFacilityId] = useState(null);
	const [atmosphericPressure, setAtmosphericPressure] = useState(null);
	const [temperature, setTemperature] = useState(null);
	const [tenaxState, setTenaxState] = useState(null);
	const [tenaxGroundState, setTenaxGroundState] = useState(null);
	const [airToxicState, setAirToxicState] = useState(null);
	const [airToxicGroundState, setAirToxicGroundState] = useState(null);
	const [filterPaperState, setFilterPaperState] = useState(false);
	const { notify, contextHolder } = useKNotification();
	const isUser = getItem("role") === "STUFF" ? true : false;
	const DataUrlId = window.location.pathname.split("/").pop();
	const [uploadedFiles, setUploadedFiles] = useState([]);
	const [fileId, setFileId] =useState()
	const [submitType, setSubmitType] = useState(null);
	const [samplingState, setSamplingState] = useState(false)

	const onFinish = async (values) => {
		if (submitType === 'tempsave') {
			await onTempSave(values);
		} else if (submitType === 'save') {
			// Validate required fields before saving
			try {
				await form.validateFields([
					'samplingRegNumber',
					'measurerId1',
					'measurerId2',
					'meaMethod',
					'meaTeam',
					'receiptDay',
					'meaDay',
					'meaStartTime',
					'meaEndTime'
				]);
				await onSave(values);
			} catch (error) {
				console.error('Validation failed:', error);
				notification.error({
					message: '필수 입력 항목을 확인하세요',
					description: '모든 필수 항목을 입력해야 합니다.'
				});
			}
		}
	};

	const onSave = async (values) => {
		setLoading(true);
		const { filterPaper, filterPaperGround } = values;
	
		// Validate filter paper inputs
		if (filterPaperState && (!filterPaper || !filterPaperGround)) {
			Modal.warning({
				title: "Warning",
				content: "여과지번호를 확인하세요",
			});
			setLoading(false);
			return;
		}
	
		try {
			const queryParams = new URLSearchParams();
			queryParams.set("samplingId", id);
			const { responseData } = await GaseousService.searchGaseouses(queryParams.toString());
	
			// Process responseData
			const validEntries = [];
			const invalidIds = [];
			responseData.forEach((item) => {
				if (item.startTime !== null && item.endTime !== null) {
					validEntries.push(item);
				} else {
					invalidIds.push(item.gaseousId);
				}
			});
	
			// Show warning if there are invalid entries
			if (invalidIds.length > 0) {
				Modal.warning({
					title: "Invalid Entries",
					content: `Entries with the following IDs have missing startTime or endTime: ${invalidIds.join(", ")}`,
				});
			}
	
			// Update sampling data
			const response = await SamplingService.updateSampling(id, values);
			if (response) {
				// Generate and add the PDF file
				const reportBlob = await generatePdfBlob(values);
				const reportFileName = `${values.samplingRegNumber}_report.pdf`;
				const reportFile = new File([reportBlob], reportFileName, { type: "application/pdf" });
				
				// Upload all files
				const uploadResponse = await SamplingService.FileUpload(reportFile, id, 'generated');
				if (!uploadResponse) {
					throw new Error("File upload failed.");
				}
			
				// Notify and navigate
				notify("success", "채취정보 수정", response);
				sessionStorage.clear();
				navigator("/collections/sampling");
			}
		} catch (error) {
			console.error(error);
			notify("error", "Error occurred", error.message || "An unknown error occurred.");
		} finally {
			setLoading(false);
		}
	};
	
	const onTempSave = async (values) => {
		setLoading(true);
		try {
			const response = await SamplingService.updateSamplingTempSave(id, values);
			if (response) {
				// Notify and navigate
				notify("success", "채취정보 수정", response);
				sessionStorage.clear();
				navigator("/collections/sampling");
			}
		} catch (error) {
			console.error(error);
			notify("error", "Error occurred", error.message || "An unknown error occurred.");
		} finally {
			setLoading(false);
		}
	};

	const generatePdfBlob = async (data) => {
		const doc = <SamplingReport data={data} />;
		return await pdf(doc).toBlob();
	};
	
	const handleCancel = () => {
		form.resetFields();
		navigator("/collections/sampling");
	};

	const handleDuplicate = () => {
		navigator(`/collections/sampling/${DataUrlId}/dup`);
	};


	const handleBlur = (e) => {
		const { id, value } = e.target;
		sessionStorage.setItem(id, value);
	};

	const fetchData = async () => {
		setLoading(true);
		try {
			const response = await SamplingService.getSampling(id);
			form.setFieldsValue(response);
			setFacilityData({
				score: parseInt(response.score) || 1,
				unitArea: parseFloat(response.unitArea) || 0,
				preventionVolume: parseFloat(response.preventionVolume) || null,
			});
			setFacilityId(response.facilityId);
			setAtmosphericPressure(response.atmosphericPressure);
			setTemperature(response.temperature);
			setTenaxState(response.tenax);
			setTenaxGroundState(response.tenaxGround);
			setAirToxicState(response.airToxic);
			setAirToxicGroundState(response.airToxicGround);
			setUploadedFiles([{fileId: response.fileUrl}])
			setFileId(response.fileUrl)
			setFacility([
				{
					facilityId: response.facilityId,
					facilityNumber: response.facilityNumber,
					companyId: response.companyId,
					companyName: response.companyName,
				},
			]);
			setMeasurer1([
				{
					value: response.measurerId1,
					label: response.measurerName1,
				},
			]);
			setMeasurer2([
				{
					value: response.measurerId2,
					label: response.measurerName2,
				},
			]);
			setExtraInfo({
				createdAt: response.createdAt,
				createdBy: response.createdBy,
				modifiedAt: response.modifiedAt,
				modifiedBy: response.modifiedBy,
			});
			setSamplingState(response.samplingStatus === "WORK_FINISHED" ? true : false)
			SamplingCalc(
				form,
				{
					score: parseInt(response.score) || 1,
					unitArea: parseFloat(response.unitArea) || 0,
					preventionVolume:
						parseFloat(response.preventionVolume) || null,
				},
				setFormula
			);
			
			setLoading(false);
		} catch (err) {
			console.log(err);
			setLoading(false);
		}
	};

	useEffect(() => {
		if (id) {
			fetchData();
		}
	}, [id]);

	useEffect(() => {}, [filterPaperState]);

	const handleCalc = async () => {
		setLoading(true);
		try {
			await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
			SamplingCalc(form, facilityData, setFormula, true);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const handleMoistureChange = () => {
		const data = form.getFieldsValue();
		const {
			moistureBefore1,
			moistureBefore2,
			moistureAfter1,
			moistureAfter2,
		} = data;
		const moistureBeforeSum = moistureBefore1 + moistureBefore2;
		const moistureAfterSum = moistureAfter1 + moistureAfter2;
		const moistureWeightDiff = moistureAfterSum - moistureBeforeSum;

		form.setFieldsValue({
			moistureBeforeSum: roundTo(moistureBeforeSum, 3),
			moistureAfterSum: roundTo(moistureAfterSum, 3),
			moistureWeightDiff: roundTo(moistureWeightDiff, 3),
		});
	};

	return (
		<Spin spinning={loading}>
			{contextHolder}
			<Form
				name="sampling_edit_form"
				form={form}
				layout="vertical"
				autoComplete="off"
				onFinish={onFinish}
				className="right-column-no-scroll"
			>
				<Row>
					<Col span={22}>
						<Card
							title={"채취정보 수정"}
							extra={
								<Space>
									<Button
										type="primary"
										onClick={handleDuplicate}
									>
										복제
									</Button>
									<Button type="primary" onClick={handleCalc}>
										계산
									</Button>
									<Popconfirm
										description={`임시저장으로 저장하시겠습니까?`}
										okText="확인"
										onConfirm={() => {
											setSubmitType('tempsave');
											form.submit(); // Programmatically trigger form submission
										}}
										cancelText="취소"
										placement="topLeft"
										icon={
										<QuestionCircleOutlined
											style={{
												color: "red",
											}}
										/>
										}
									>
										<Button
											disabled={samplingState}
											type="primary" 
										>
											임시저장
										</Button>
									</Popconfirm>
									<Popconfirm
										description={`저장하시겠습니까?`}
										okText="확인"
										cancelText="취소"
										onConfirm={() => {
											setSubmitType('save');
											form.submit(); // Programmatically trigger form submission
										}}
										placement="topLeft"
										icon={
										<QuestionCircleOutlined
											style={{
												color: "red",
											}}
										/>
										}
									>
										<Button
											type="primary"
										>
											저장
										</Button>

									</Popconfirm>
									<Item noStyle>
									</Item>
									<Button onClick={handleCancel}>
										{" "}
										닫기
									</Button>
								</Space>
							}
							styles={{
								body: {
									height: 855,
									overflow: "auto",
									background: "rgba(0, 0, 0, 0.02)",
								},
							}}
						>
							<div style={{ height: 1000 }}>
								<Collapse
									collapsible={"icon"}
									defaultActiveKey={[
										"card1",
										"card3",
										"card4",
										"card5",
										"card6",
										"card7",
										"card8",
										"card9",
										"card10",
									]}
									items={[
										{
											key: "card1",
											id: "card1",
											label: "채취정보",
											children: (
												<div>
													<div
														style={{
															display: "flex",
															flexWrap: "wrap",
															gap: "0px 16px",
														}}
													>
														<Item
															label={"접수번호"}
															name={"samplingRegNumber"}
															rules={[
																{
																	required: submitType === 'save',
																	message: "Please enter ",
																},
															]}
															onBlur={handleBlur}
														>
															<Input />
														</Item>

														<Item
															label={"측정자 1"}
															name={"measurerId1"}
															rules={[
																{
																	required: submitType === 'save',
																	message: "측정자 1",
																},
															]}
														>
															<SelectUser
																selectedUser={measurer1}
																setSelectedUser={setMeasurer1}
																placeholder={"측정자 1"}
															/>
														</Item>
														<Item
															label={"측정자 2"}
															name={"measurerId2"}
															rules={[
																{
																	required: submitType === 'save',
																	message: "측정자 2",
																},
															]}
														>
															<SelectUser
																selectedUser={measurer2}
																setSelectedUser={setMeasurer2}
																placeholder={"측정자 2"}
															/>
														</Item>

														<Item
															label={"검사목적"}
															name={"inspectionPurpose"}
															initialValue={"MEASUREMENT"}
															required
														>
															<SelectInspection />
														</Item>
														<Item
															label={"처리구분"}
															name={"processClassification"}
															initialValue={"COMMON"}
															required
														>
															<SelectProcess />
														</Item>
														<Item
															label={"조"}
															name={"meaMethod"}
															initialValue={null}
															rules={[
																{
																	required: submitType === 'save',
																	message: "조",
																},
															]}
														>
															<SelectMeaMethod />
														</Item>
														<Item
															label={"측정법"}
															name={"meaTeam"}
															initialValue={null}
															rules={[
																{
																	required: submitType === 'save',
																	message: "측정법",
																},
															]}
														>
															<SelectTeamType />
														</Item>
														<Item
															label={"접수일"}
															name={"receiptDay"}
															rules={[
																{
																	required: submitType === 'save',
																	message: "접수일",
																},
															]}
														>
															<KDatePicker />
														</Item>
														<Item
															label={"측정일"}
															name={"meaDay"}
															rules={[
																{
																	required: submitType === 'save',
																	message: "측정일",
																},
															]}
														>
															<KDatePicker />
														</Item>

														<Item
															label={"측정 시간"}
															style={{
																width: 300,
															}}
														>
															<Compact block>
																<Item
																	name={"meaStartTime"}
																	noStyle
																	rules={[
																		{
																			required: submitType === 'save',
																			message: "",
																		},
																	]}
																>
																	<KTimePicker />
																</Item>
																<Input
																	style={{
																		width: 30,
																		borderLeft: 0,
																		borderRight: 0,
																		textAlign:
																			"center",
																		pointerEvents:
																			"none",
																	}}
																	placeholder="~"
																	disabled
																/>
																<Item
																	name={"meaEndTime"}
																	noStyle
																	rules={[
																		{
																			required: submitType === 'save',
																			message: "측정 시간",
																		},
																	]}
																>
																	<KTimePicker />
																</Item>
															</Compact>
														</Item>
														<Item
															label={"여과지 사용여부"}
															name={"filterPaperState"}
															initialValue={
																filterPaperState ??
																false
															}
															rules={[
																{
																	required: true,
																	message: "",
																},
															]}
														>
															<Select
																onChange={(e) =>
																	setFilterPaperState(
																		e
																	)
																}
																options={[
																	{
																		label: "사용",
																		value: true,
																	},
																	{
																		label: "미사용",
																		value: false,
																	},
																]}
															/>
														</Item>
													</div>
													<Item
														label={"채취자의견"}
														name={"meaOpinion"}
													>
														<TextArea
															rows={1}
															placeholder="채취자의견"
															style={{
																width: 616,
																minWidth: 300,
															}}
														/>
													</Item>
												</div>
											),
										},
										{
											key: "card2",
											id: "card2",
											label: "업체명 / 시설명",
											extra: (
												<Item
													name={"facilityId"}
													rules={[
														{
															required: true,
															message:
																"Please enter ",
														},
													]}
													noStyle
												>
													<SelectFacility
														initData={facility}
														onChange={(value) =>
															setFacilityId(value)
														}
														style={{ width: 300 }}
													/>
												</Item>
											),
											children: (
												<div>
													<SamplingCompanyInfo
														facilityId={facilityId}
														setFacilityData={
															setFacilityData
														}
														form={form}
													/>
												</div>
											),
										},
										{
											key: "card3",
											id: "card3",
											label: "기상정보",
											children: (
												<div
													style={{
														display: "flex",
														flexWrap: "wrap",
														gap: "0px 16px",
													}}
												>
													<Item
														label={"날씨"}
														name={"weather"}
														initialValue={null}
													>
														<SelectWeather />
													</Item>

													<Item
														label={"기온 (˚C)"}
														name={"temperature"}
													>
														<KInputNum
															addonAfter="˚C"
															onChange={(v) =>
																setTemperature(
																	v
																)
															}
														/>
													</Item>
													<Item
														label={"습도 (%)"}
														name={"humidity"}
													>
														<KInputNum addonAfter="%" />
													</Item>
													<Item
														label={"대기압 (mmHg)"}
														name={
															"atmosphericPressure"
														}
													>
														<KInputNum
															addonAfter="mmHg"
															onChange={(v) =>
																setAtmosphericPressure(
																	v
																)
															}
														/>
													</Item>
													<Item
														label={"풍향"}
														name={"windDirection"}
														initialValue={null}
													>
														<SelectWindDirection />
													</Item>
													<Item
														label={"풍속 (m/s)"}
														name={"windSpeed"}
													>
														<KInputNum addonAfter="m/s" />
													</Item>
													<Item
														label={"매연"}
														name={"smoke"}
														initialValue={null}
													>
														<SelectSmoke />
													</Item>
													<Item
														label={"표준산소량 (%)"}
														name={"stdOxygen"}
													>
														<KInputNum
															addonAfter="%"
															disabled={true}
														/>
													</Item>
													<Item
														label={"공기비"}
														name={"airRatio"}
													>
														<KInputNum
															disabled={true}
														/>
													</Item>
													<Item
														label={"측정 O2 (%)"}
														name={"measureO2"}
													>
														<KInputNum
															addonAfter="%"
															onChange={(
																value
															) => {
																const stdOxygen =
																	form.getFieldValue(
																		"stdOxygen"
																	) || 0;
																const measureO2 =
																	value || 0;
																let airRatio = 1;
																if (
																	stdOxygen !==
																		0 &&
																	measureO2 !==
																		0 &&
																	measureO2 !==
																		21
																) {
																	airRatio =
																		(21 -
																			stdOxygen) /
																		(21 -
																			measureO2);
																}
																const measureCO2 =
																	form.getFieldValue(
																		"measureCO2"
																	);

																const nitrogen =
																	100 -
																	value -
																	measureCO2;
																form.setFieldsValue(
																	{
																		airRatio:
																			roundTo(
																				airRatio,
																				2
																			) ||
																			1,
																		nitrogen:
																			roundTo(
																				nitrogen,
																				2
																			),
																	}
																);
															}}
														/>
													</Item>
													<Item
														label={"측정 CO2 (%)"}
														name={"measureCO2"}
													>
														<KInputNum
															addonAfter="%"
															onChange={(
																value
															) => {
																const measureO2 =
																	form.getFieldValue(
																		"measureO2"
																	);
																const nitrogen =
																	100 -
																	measureO2 -
																	value;
																form.setFieldsValue(
																	{
																		nitrogen:
																			roundTo(
																				nitrogen,
																				2
																			),
																	}
																);
															}}
														/>
													</Item>
													<Item
														label={"질소 (%)"}
														name={"nitrogen"}
													>
														<KInputNum
															addonAfter="%"
															disabled={true}
														/>
													</Item>
												</div>
											),
										},
										{
											key: "card4",
											id: "card4",
											label: "공통정보",
											children: (
												<div>
													<div
														style={{
															display: "flex",
															flexWrap: "wrap",
															gap: "0px 16px",
														}}
													>
														<Item
															label={
																"흡인가스 유량 (L/min)"
															}
															name={
																"suctionGasFlowRate"
															}
														>
															<KInputNum addonAfter="L/min" />
														</Item>
														<Item
															label={
																"흡인가스량 (L)"
															}
															name={
																"suctionGasAmount"
															}
														>
															<KInputNum addonAfter="L" />
														</Item>
														<Item
															label={
																"가스미터 온도 (˚C)"
															}
															name={
																"gasMeterTemp"
															}
														>
															<KInputNum addonAfter="˚C" />
														</Item>
														<Item
															label={
																"가스 게이지압 (mmH2O)"
															}
															name={
																"gaugePressureH2O"
															}
														>
															<KInputNum
																addonAfter="mmH2O"
																onChange={(
																	value
																) => {
																	const gaugePressureHg =
																		value *
																		0.0735559;
																	form.setFieldValue(
																		"gaugePressureHg",
																		roundTo(
																			gaugePressureHg,
																			2
																		)
																	);
																}}
															/>
														</Item>
														<Item
															label={
																"가스 게이지압 (mmHg)"
															}
															name={
																"gaugePressureHg"
															}
														>
															<KInputNum
																addonAfter="mmHg"
																disabled={true}
															/>
														</Item>
													</div>
													<div
														style={{
															display: "flex",
															flexWrap: "wrap",
															gap: "0px 16px",
														}}
													>
														<Item
															label={
																"가스미터 (m3) 채취전"
															}
															name={
																"gasMeterCollBefore"
															}
														>
															<KInputNum
																addonAfter="m³"
																onChange={(
																	value
																) => {
																	const gasMeterCollAfter =
																		form.getFieldValue(
																			"gasMeterCollAfter"
																		);
																	const gasMeterCollResult =
																		gasMeterCollAfter -
																		value;
																	form.setFieldValue(
																		"gasMeterCollResult",
																		roundTo(
																			gasMeterCollResult,
																			3
																		)
																	);
																}}
															/>
														</Item>
														<Item
															label={
																"가스미터 (m3) 채취후"
															}
															name={
																"gasMeterCollAfter"
															}
														>
															<KInputNum
																addonAfter="m³"
																onChange={(
																	value
																) => {
																	const gasMeterCollBefore =
																		form.getFieldValue(
																			"gasMeterCollBefore"
																		);
																	const gasMeterCollResult =
																		value -
																		gasMeterCollBefore;
																	form.setFieldValue(
																		"gasMeterCollResult",
																		roundTo(
																			gasMeterCollResult,
																			3
																		)
																	);
																}}
															/>
														</Item>
														<Item
															label={
																"가스미터 (m3) 후-전"
															}
															name={
																"gasMeterCollResult"
															}
														>
															<KInputNum
																addonAfter="m³"
																disabled={true}
															/>
														</Item>
														<Item
															label={
																"무수염화칼슘소모량 (g) 1"
															}
															name={
																"cacl2Wastage1"
															}
														>
															<KInputNum addonAfter="g" />
														</Item>
														<Item
															label={
																"무수염화칼슘소모량 (g) 2"
															}
															name={
																"cacl2Wastage2"
															}
														>
															<KInputNum addonAfter="g" />
														</Item>
													</div>

													<div>
														<Item
															label={"수분 정보"}
														>
															<Space
																direction="vertical"
																size={2}
															>
																<Compact
																	style={{
																		maxWidth: 616,
																	}}
																>
																	<Item
																		name={
																			"moistureBefore1"
																		}
																		noStyle
																	>
																		<InputNumber
																			addonBefore={
																				"전무게"
																			}
																			addonAfter={
																				"+"
																			}
																			style={{
																				width: "40%",
																			}}
																			controls={
																				false
																			}
																			onChange={
																				handleMoistureChange
																			}
																		/>
																	</Item>

																	<Item
																		name={
																			"moistureBefore2"
																		}
																		noStyle
																	>
																		<InputNumber
																			addonAfter={
																				"="
																			}
																			style={{
																				width: "30%",
																			}}
																			controls={
																				false
																			}
																			onChange={
																				handleMoistureChange
																			}
																		/>
																	</Item>

																	<Item
																		name={
																			"moistureBeforeSum"
																		}
																		noStyle
																	>
																		<InputNumber
																			readOnly={
																				true
																			}
																			addonAfter="g"
																			style={{
																				width: "30%",
																			}}
																		/>
																	</Item>
																</Compact>
																<Compact
																	style={{
																		maxWidth: 616,
																	}}
																>
																	<Item
																		name={
																			"moistureAfter1"
																		}
																		noStyle
																	>
																		<InputNumber
																			addonBefore={
																				"후무게"
																			}
																			addonAfter={
																				"+"
																			}
																			onChange={
																				handleMoistureChange
																			}
																			style={{
																				width: "40%",
																			}}
																			controls={
																				false
																			}
																		/>
																	</Item>

																	<Item
																		name={
																			"moistureAfter2"
																		}
																		noStyle
																	>
																		<InputNumber
																			addonAfter={
																				"="
																			}
																			onChange={
																				handleMoistureChange
																			}
																			style={{
																				width: "30%",
																			}}
																			controls={
																				false
																			}
																		/>
																	</Item>

																	<Item
																		name={
																			"moistureAfterSum"
																		}
																		noStyle
																	>
																		<InputNumber
																			readOnly={
																				true
																			}
																			addonAfter="g"
																			style={{
																				width: "30%",
																			}}
																		/>
																	</Item>
																</Compact>
																<Compact
																	style={{
																		width: 616,
																	}}
																>
																	<Item
																		name={
																			"moistureAfterSum"
																		}
																		noStyle
																	>
																		<InputNumber
																			addonBefore={
																				"무게차"
																			}
																			readOnly={
																				true
																			}
																			addonAfter={
																				"-"
																			}
																			style={{
																				width: "40%",
																			}}
																		/>
																	</Item>
																	<Item
																		name={
																			"moistureBeforeSum"
																		}
																		noStyle
																	>
																		<InputNumber
																			readOnly={
																				true
																			}
																			addonAfter={
																				"="
																			}
																			style={{
																				width: "30%",
																			}}
																		/>
																	</Item>
																	<Item
																		label={
																			"수분 무게차 ma (g)"
																		}
																		name={
																			"moistureWeightDiff"
																		}
																		noStyle
																	>
																		<InputNumber
																			addonAfter="g"
																			readOnly={
																				true
																			}
																			style={{
																				width: "30%",
																			}}
																		/>
																	</Item>
																</Compact>
															</Space>
														</Item>
													</div>
												</div>
											),
										},
										{
											key: "card5",
											id: "card5",
											label: "입자상 및 기타 정보",
											children: (
												<div>
													<div
														style={{
															display: "flex",
															flexWrap: "wrap",
															gap: "0px 16px",
														}}
													>
														<Item
															label={"여과지번호"}
															style={{
																width: 300,
															}}
														>
															<Compact block>
																<Item
																	name={
																		"filterPaper"
																	}
																	noStyle
																>
																	<Input />
																</Item>
																<Input
																	style={{
																		width: 100,
																		borderLeft: 0,
																		borderRight: 0,
																		textAlign:
																			"center",
																		pointerEvents:
																			"none",
																	}}
																	placeholder="바탕:"
																	disabled
																/>
																<Item
																	name={
																		"filterPaperGround"
																	}
																	noStyle
																>
																	<Input
																		style={{
																			width: 150,
																		}}
																	/>
																</Item>
															</Compact>
														</Item>
														<Item
															label={"Tenax"}
															style={{
																width: 300,
															}}
														>
															<Compact block>
																<Item
																	name={
																		"tenax"
																	}
																	noStyle
																>
																	<Input
																		onBlur={(
																			e
																		) => {
																			setTenaxState(
																				e
																					.target
																					.value
																			);
																		}}
																	/>
																</Item>
																<Input
																	style={{
																		width: 100,
																		borderLeft: 0,
																		borderRight: 0,
																		textAlign:
																			"center",
																		pointerEvents:
																			"none",
																	}}
																	placeholder="바탕:"
																	disabled
																/>
																<Item
																	name={
																		"tenaxGround"
																	}
																	noStyle
																>
																	<Input
																		style={{
																			width: 150,
																		}}
																		onBlur={(
																			e
																		) => {
																			setTenaxGroundState(
																				e
																					.target
																					.value
																			);
																		}}
																	/>
																</Item>
															</Compact>
														</Item>
														<Item
															label={"Air Toxic"}
															style={{
																width: 300,
															}}
														>
															<Compact block>
																<Item
																	name={
																		"airToxic"
																	}
																	noStyle
																>
																	<Input
																		onBlur={(
																			e
																		) => {
																			setAirToxicState(
																				e
																					.target
																					.value
																			);
																		}}
																	/>
																</Item>
																<Input
																	style={{
																		width: 100,
																		borderLeft: 0,
																		borderRight: 0,
																		textAlign:
																			"center",
																		pointerEvents:
																			"none",
																	}}
																	placeholder="바탕:"
																	disabled
																/>
																<Item
																	name={
																		"airToxicGround"
																	}
																	noStyle
																>
																	<Input
																		style={{
																			width: 150,
																		}}
																		onBlur={(
																			e
																		) => {
																			setAirToxicGroundState(
																				e
																					.target
																					.value
																			);
																		}}
																	/>
																</Item>
															</Compact>
														</Item>
														<Item label={"TS (K)"}>
															<Compact
																style={{
																	width: 300,
																}}
															>
																<Item
																	name={
																		"emsGasTempAvg"
																	}
																	noStyle
																>
																	<InputNumber
																		readOnly={
																			true
																		}
																		addonAfter={
																			"+ 273 ="
																		}
																	/>
																</Item>

																<Item
																	name={"ts"}
																	noStyle
																>
																	<InputNumber
																		readOnly={
																			true
																		}
																		style={{
																			width: 100,
																		}}
																	/>
																</Item>
															</Compact>
														</Item>

														<Item label={"TM (K)"}>
															<Compact
																style={{
																	width: 300,
																}}
															>
																<Item
																	name={
																		"gasMeterTempInAvg"
																	}
																	noStyle
																>
																	<InputNumber
																		readOnly={
																			true
																		}
																		addonAfter={
																			"+ 273 ="
																		}
																	/>
																</Item>

																<Item
																	name={"tm"}
																	noStyle
																>
																	<InputNumber
																		readOnly={
																			true
																		}
																		style={{
																			width: 150,
																		}}
																	/>
																</Item>
															</Compact>
														</Item>
													</div>
													<div
														style={{
															display: "flex",
															flexWrap: "wrap",
															gap: "0px 16px",
														}}
													>
														<OptimaTime
															onChange={(
																optimaStartTime,
																optimaEndTime
															) => {
																form.setFieldsValue(
																	{
																		optimaStartTime,
																		optimaEndTime,
																	}
																);
															}}
														/>
														<Item
															label={
																"노즐직경 (mm)"
															}
														>
															<Compact>
																<Item
																	name={
																		"meaMethod"
																	}
																	noStyle
																>
																	<SelectMeaMethod
																		disabled={
																			true
																		}
																		style={{
																			width: 100,
																		}}
																	/>
																</Item>
																<Item
																	name={
																		"exposureDiameter"
																	}
																	noStyle
																>
																	<InputNumber
																		style={{
																			width: 200,
																		}}
																		addonAfter="mm"
																		onChange={(
																			value
																		) => {
																			const expArea =
																				(Math.pow(
																					value,
																					2
																				) *
																					3.14159) /
																				4 /
																				100;
																			form.setFieldValue(
																				"exposedArea",
																				roundTo(
																					expArea,
																					3
																				)
																			);
																		}}
																	/>
																</Item>
															</Compact>
														</Item>

														<Item
															label={
																"노즐면적 (cm²)"
															}
															name={"exposedArea"}
															initialValue={0.0}
														>
															<KInputNum
																addonAfter="cm²"
																disabled={true}
															/>
														</Item>
														<Item
															label={
																"피토우관계수"
															}
															name={"pitotTube"}
															initialValue={null}
														>
															<Select allowClear>
																<Select.Option
																	value={0.82}
																>
																	0.820
																</Select.Option>
																<Select.Option
																	value={
																		0.821
																	}
																>
																	{" "}
																	0.821
																</Select.Option>
																<Select.Option
																	value={
																		0.822
																	}
																>
																	0.822
																</Select.Option>
																<Select.Option
																	value={
																		0.823
																	}
																>
																	0.823
																</Select.Option>
																<Select.Option
																	value={
																		0.824
																	}
																>
																	0.824
																</Select.Option>
																<Select.Option
																	value={
																		0.825
																	}
																>
																	0.825
																</Select.Option>
															</Select>
														</Item>
														<Item
															label={
																"오리피스미터 (△H)"
															}
															name={
																"orificeMeter"
															}
															initialValue={null}
														>
															<Select allowClear>
																<Select.Option
																	value={46.3}
																>
																	46.3
																</Select.Option>
																<Select.Option
																	value={47.2}
																>
																	47.2
																</Select.Option>
																<Select.Option
																	value={47.4}
																>
																	47.4
																</Select.Option>
																<Select.Option
																	value={47.7}
																>
																	47.7
																</Select.Option>
																<Select.Option
																	value={48.6}
																>
																	48.6
																</Select.Option>
																<Select.Option
																	value={49.1}
																>
																	49.1
																</Select.Option>
																<Select.Option
																	value={49.2}
																>
																	49.2
																</Select.Option>
																<Select.Option
																	value={49.3}
																>
																	49.3
																</Select.Option>
															</Select>
														</Item>
													</div>
												</div>
											),
										},
										{
											key: "card6",
											id: "card6",
											label: "측정 지점별 채취정보",
											children: (
												<div>
													<ParticulateTable
														score={
															facilityData.score
														}
														form={form}
													/>
												</div>
											),
										},
										{
											key: "card7",
											id: "card7",
											label: "결과",
											children: (
												<div>
													<ParticulateResult
														form={form}
														formula={formula}
													/>
												</div>
											),
										},
										{
											key: "card8",
											id: "card8",
											label: "메모",
											children: (
												<div>
													<SamplingMemo regNum={id} fileId={fileId} setFileId={setFileId} uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles} />
												</div>
											)
										},
										{
											key: "card9",
											id: "card9",
											label: "상태",
											children: (
												<Flex justify="space-between">
													<div>
														<Item
															label="상태"
															name="state"
														>
															<RadioState
																isUser={isUser}
															/>
														</Item>
														<EntityInfo
															data={extraInfo}
														/>
													</div>
													<div>
														<Item
															label="문의 상태"
															name="inquiryState"
														>
															<RadioState
																isUser={isUser}
															/>
														</Item>
														<EntityInfo
															data={''}
														/>
													</div>
													<div>
														<Item
															label="Ilab 상태"
															name="ilabState"
														>
															<RadioState
																isUser={isUser}
															/>
														</Item>
														<EntityInfo
															data={''}
														/>
													</div>
													<div>
														<Item
															label="EcoLab 상태"
															name="ecoLabState"
														>
															<RadioState
																isUser={isUser}
															/>
														</Item>
														<EntityInfo
															data={''}
														/>
													</div>
												</Flex>

											),
										},
										{
											key: "card10",
											id: "card10",
											label: "측정항목",
											children: (
												<Gaseous
													notify={notify}
													facilityId={facilityId}
													tenaxValue={tenaxState}
													tenaxGroundValue={
														tenaxGroundState
													}
													airToxicValue={
														airToxicState
													}
													airToxicGroundValue={
														airToxicGroundState
													}
													atmosphericPressure={
														atmosphericPressure
													}
													temperature={temperature}
												/>
											),
										},
									]}
								/>
							</div>
						</Card>
					</Col>

					<Col span={2}>
						<Anchor
							affix={false}
							replace
							items={[
								{
									key: "card1",
									href: "#card1",
									title: "채취정보",
								},
								{
									key: "card2",
									href: "#card2",
									title: "업체명 / 시설명",
								},
								{
									key: "card3",
									href: "#card3",
									title: "기상정보",
								},
								{
									key: "card4",
									href: "#card4",
									title: "공통정보",
								},
								{
									key: "card5",
									href: "#card5",
									title: "입자상 및 기타 정보",
								},
								{
									key: "card6",
									href: "#card6",
									title: "측정 지점별 채취정보",
								},
								{
									key: "card7",
									href: "#card7",
									title: "결과",
								},
								{
									key: "card8",
									href: "#card8",
									title: "메모",
								},
								{
									key: "card9",
									href: "#card9",
									title: "상태",
								},
								{
									key: "card10",
									href: "#card10",
									title: "측정항목",
								},
							]}
						/>
					</Col>
				</Row>
			</Form>
		</Spin>
	);
};

export default SamplingEdit;
