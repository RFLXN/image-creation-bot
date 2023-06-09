import { get, post } from "./share";

interface Config {
    samplesSave: boolean;
    samplesFormat: string;
    samplesFilenamePattern: string;
    saveImagesAddNumber: boolean;
    gridSave: boolean;
    gridFormat: string;
    gridExtendedFilename: boolean;
    gridOnlyIfMultiple: boolean;
    gridPreventEmptySpots: boolean;
    nRows: number;
    enablePnginfo: boolean;
    saveTxt: boolean;
    saveImagesBeforeFaceRestoration: boolean;
    saveImagesBeforeHighresFix: boolean;
    saveImagesBeforeColorCorrection: boolean;
    saveMask: boolean;
    saveMaskComposite: boolean;
    jpegQuality: number;
    webpLossless: boolean;
    exportFor_4chan: boolean;
    imgDownscaleThreshold: number;
    targetSideLength: number;
    imgMaxSizeMp: number;
    useOriginalNameBatch: boolean;
    useUpscalerNameAsSuffix: boolean;
    saveSelectedOnly: boolean;
    doNotAddWatermark: boolean;
    tempDir: string;
    cleanTempDirAtStart: boolean;
    outdirSamples: string;
    outdirTxt2imgSamples: string;
    outdirImg2imgSamples: string;
    outdirExtrasSamples: string;
    outdirGrids: string;
    outdirTxt2imgGrids: string;
    outdirImg2imgGrids: string;
    outdirSave: string;
    saveToDirs: boolean;
    gridSaveToDirs: boolean;
    useSaveToDirsForUi: boolean;
    directoriesFilenamePattern: string;
    directoriesMaxPromptWords: number;
    esrganTile: number;
    esrganTileOverlap: number;
    realesrganEnabledModels: string[];
    upscalerForImg2img: null | string;
    faceRestorationModel: string;
    codeFormerWeight: number;
    faceRestorationUnload: boolean;
    showWarnings: boolean;
    memmonPollRate: number;
    samplesLogStdout: boolean;
    multipleTqdm: boolean;
    printHypernetExtra: boolean;
    unloadModelsWhenTraining: boolean;
    pinMemory: boolean;
    saveOptimizerState: boolean;
    saveTrainingSettingsToTxt: boolean;
    datasetFilenameWordRegex: string;
    datasetFilenameJoinString: string;
    trainingImageRepeatsPerEpoch: number;
    trainingWriteCsvEvery: number;
    trainingXattentionOptimizations: boolean;
    trainingEnableTensorboard: boolean;
    trainingTensorboardSaveImages: boolean;
    trainingTensorboardFlushEvery: number;
    sdModelCheckpoint: string;
    sdCheckpointCache: number;
    sdVaeCheckpointCache: number;
    sdVae: string;
    sdVaeAsDefault: boolean;
    inpaintingMaskWeight: number;
    initialNoiseMultiplier: number;
    img2imgColorCorrection: boolean;
    img2imgFixSteps: boolean;
    img2imgBackgroundColor: string;
    enableQuantization: boolean;
    enableEmphasis: boolean;
    enableBatchSeeds: boolean;
    commaPaddingBacktrack: number;
    clipStopAtLastLayers: number;
    upcastAttn: boolean;
    useOldEmphasisImplementation: boolean;
    useOldKarrasSchedulerSigmas: boolean;
    noDpmppSdeBatchDeterminism: boolean;
    useOldHiresFixWidthHeight: boolean;
    interrogateKeepModelsInMemory: boolean;
    interrogateReturnRanks: boolean;
    interrogateClipNumBeams: number;
    interrogateClipMinLength: number;
    interrogateClipMaxLength: number;
    interrogateClipDictLimit: number;
    interrogateClipSkipCategories: string[];
    interrogateDeepbooruScoreThreshold: number;
    deepbooruSortAlpha: boolean;
    deepbooruUseSpaces: boolean;
    deepbooruEscape: boolean;
    deepbooruFilterTags: string;
    extraNetworksDefaultView: string;
    extraNetworksDefaultMultiplier: number;
    extraNetworksCardWidth: number;
    extraNetworksCardHeight: number;
    extraNetworksAddTextSeparator: string;
    sdHypernetwork: string;
    returnGrid: boolean;
    returnMask: boolean;
    returnMaskComposite: boolean;
    doNotShowImages: boolean;
    addModelHashToInfo: boolean;
    addModelNameToInfo: boolean;
    disableWeightsAutoSwap: boolean;
    sendSeed: boolean;
    sendSize: boolean;
    font: string;
    jsModalLightbox: boolean;
    jsModalLightboxInitiallyZoomed: boolean;
    showProgressInTitle: boolean;
    samplersInDropdown: boolean;
    dimensionsAndBatchTogether: boolean;
    keyeditPrecisionAttention: number;
    keyeditPrecisionExtra: number;
    quicksettings: string;
    hiddenTabs: string[];
    uiReorder: string;
    uiExtraNetworksTabReorder: string;
    localization: string;
    showProgressbar: boolean;
    livePreviewsEnable: boolean;
    showProgressGrid: boolean;
    showProgressEveryNSteps: number;
    showProgressType: string;
    livePreviewContent: string;
    livePreviewRefreshPeriod: number;
    hideSamplers: string[];
    etaDdim: number;
    etaAncestral: number;
    ddimDiscretize: string;
    sChurn: number;
    sTmin: number;
    sNoise: number;
    etaNoiseSeedDelta: number;
    alwaysDiscardNextToLastSigma: boolean;
    uniPcVariant: string;
    uniPcSkipType: string;
    uniPcOrder: number;
    uniPcLowerOrderFinal: boolean;
    postprocessingEnableInMainUi: string[];
    postprocessingOperationOrder: string[];
    upscalingMaxImagesInCache: number;
    disabledExtensions: string[];
    disableAllExtensions: string;
    sdCheckpointHash: string;
    sdLora: string;
}

const PATH = "/sdapi/v1/options";

const setConfig = async (data: Partial<Config>) => post(PATH, data);

const getConfig = async () => get<Config>(PATH);

export { Config, setConfig, getConfig };
