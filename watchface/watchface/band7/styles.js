/// <reference path="../../.types/index.d.ts" />

import {img,range} from "../../utils/helper";
import {Colors} from "../../utils/config/constants";

const bgNumArr = range(10).map((v) => {
    return img(`bgNum/${v}.png`);
});

const bigNumArr = range(10).map((v) => {
    return img(`bigNum/${v}.png`);
});

// also used for bg value in AOD
const bigNumAODArr = range(10).map((v) => {
    return img(`bigNumAOD/${v}.png`);
});

const smallNumArr = range(10).map((v) => {
    return img(`smallNum/${v}.png`);
});

const smallNumAccentArr = range(10).map((v) => {
    return img(`smallNumAccent/${v}.png`);
});

const weekEnArr = range(1, 8).map((v) => {
    return img(`week_en/${v}.png`);
});

const weatherArr = range(29).map((v) => {
    return img(`weather/${v}.png`);
});

const moonArr = range(1, 30).map((v) => {
    return img(`moon/${v}.png`);
});

const heartArr = range(1, 7).map((v) => {
    return img(`widgets/heart/heart${v}.png`);
});


export const DIGITAL_TIME = {
    hour_startX: px(18),
    hour_startY: px(35),
    hour_zero: true,
    hour_space: 2,
    hour_align: hmUI.align.CENTER_H,
    hour_array: bigNumArr,
    hour_unit_sc: img('bigNum/sp.png'), // colon
    hour_unit_tc: img('bigNum/sp.png'),
    hour_unit_en: img('bigNum/sp.png'),
    minute_zero: true,
    minute_space: 2,
    minute_align: hmUI.align.CENTER_H,
    minute_array: bigNumArr,
    minute_follow: 1,
    am_x: px(137),
    am_y: px(40),
    am_sc_path: img('bigNum/am.png'),
    am_en_path: img('bigNum/am.png'),
    pm_x: px(137),
    pm_y: px(40),
    pm_sc_path: img('bigNum/pm.png'),
    pm_en_path: img('bigNum/pm.png'),
    show_level: hmUI.show_level.ONLY_NORMAL
};

export const DIGITAL_TIME_AOD = {
    hour_startX: px(2),
    hour_startY: px(96),
    hour_array: bigNumAODArr,
    hour_unit_sc: img('bigNumAOD/sp.png'), // colon
    hour_unit_tc: img('bigNumAOD/sp.png'),
    hour_unit_en: img('bigNumAOD/sp.png'),
    minute_array: bigNumAODArr,
    am_sc_path: img('bigNumAOD/am.png'),
    am_en_path: img('bigNumAOD/am.png'),
    am_x: px(152),
    am_y: px(106),
    pm_sc_path: img('bigNumAOD/pm.png'),
    pm_en_path: img('bigNumAOD/pm.png'),
    pm_x: px(152),
    pm_y: px(106),
    show_level: hmUI.show_level.ONAL_AOD
};

const dateX = px(95);
const dateY = px(111);
const dateFontWidth = 16; // widest image in font array
const dateDotWidth = 7;
const dateFontSpacing = 1;
export const DATE_TEXT_IMG = {
    day_startX: px(dateX),
    day_startY: px(dateY),
    day_zero: 1,
    day_space: dateFontSpacing,
    day_follow: 0,
    day_align: hmUI.align.LEFT,
    day_sc_array: smallNumAccentArr,
    day_tc_array: smallNumAccentArr,
    day_en_array: smallNumAccentArr,
    day_unit_sc: img('smallNumAccent/d.png'), // dot
    day_unit_tc: img('smallNumAccent/d.png'),
    day_unit_en: img('smallNumAccent/d.png'),
    month_startX: px(dateX + (dateFontWidth * 2) + dateDotWidth + (dateFontSpacing * 3)),
    month_startY: px(dateY),
    month_follow: 0,
    month_zero: 1,
    month_space: dateFontSpacing,
    month_align: hmUI.align.LEFT,
    month_sc_array: smallNumAccentArr,
    month_tc_array: smallNumAccentArr,
    month_en_array: smallNumAccentArr,
    // month_unit_sc: img('smallNumAccent/d.png'), // dot
    // month_unit_tc: img('smallNumAccent/d.png'),
    // month_unit_en: img('smallNumAccent/d.png'),
    show_level: hmUI.show_level.ONLY_NORMAL
};

export const WEEK_DAYS_IMG = {
    x: px(36),
    y: px(111),
    week_en: weekEnArr,
    week_tc: weekEnArr,
    week_sc: weekEnArr,
    show_level: hmUI.show_level.ONLY_NORMAL
};

export const BG_VALUE_NO_DATA_TEXT = {
    x: px(66),
    y: px(193),
    w: px(59),
    h: px(46),
    color: Colors.white,
    text_size: px(34),
    align_h: hmUI.align.RIGHT,
    align_v: hmUI.align.CENTER_V,
    text_style: hmUI.text_style.NONE,
    text: 'No data',
    show_level: hmUI.show_level.ONLY_NORMAL
};

export const BG_VALUE_TEXT_IMG = {
    x: px(46),
    y: px(170),
    w: px(113),
    align_h: hmUI.align.CENTER_H,
    dot_image: img('bgNum/d.png'),
    font_array: bgNumArr,
    visible: false,
    h_space:1,
    show_level: hmUI.show_level.ONLY_NORMAL
};

export const BG_VALUE_TEXT_IMG_AOD = {
    x: px(46),
    y: px(184),
    w: px(113),
    dot_image: img('bigNumAOD/d.png'),
    font_array: bigNumAODArr,
    show_level: hmUI.show_level.ONAL_AOD
};

export const BG_TIME_TEXT = {
    x: px(61),
    y: px(320),
    w: px(63),
    h: px(30),
    color: Colors.defaultTransparent,
    text_size: px(23),
    align_h: hmUI.align.CENTER_H,
    align_v: hmUI.align.TOP,
    text_style: hmUI.text_style.NONE,
    show_level: hmUI.show_level.ONLY_NORMAL
};

export const BG_DELTA_TEXT = {
    x: px(74),
    y: px(173),
    w: px(38),
    h: px(41),
    color: Colors.defaultTransparent,
    text_size: px(27),
    align_h: hmUI.align.CENTER_H,
    align_v: hmUI.align.TOP,
    text_style: hmUI.text_style.NONE,
    show_level: hmUI.show_level.ONLY_NORMAL
};

export const BG_TREND_IMAGE = {
    src: 'nightscout/arrows/None.png',
    x: px(75),
    y: px(238),
    w: px(60),
    h: px(41),
    show_level: hmUI.show_level.ONLY_NORMAL
};

export const BG_STALE_IMG = {
    x: px(69),
    y: px(135),
    src: 'nightscout/stale.png',
    visible: false,
    show_level: hmUI.show_level.ONLY_NORMAL
};

// Xdrip modified to put ExternalStatusService.getLastStatusLine()
export const AAPS_TEXT = {
    x: px(10),
    y: px(288),
    w: px(165),
    h: px(27),
    color: Colors.white,
    text_size: px(24),
    align_h: hmUI.align.CENTER_H,
    align_v: hmUI.align.CENTER_V,
    text_style: hmUI.text_style.NONE,
    show_level: hmUI.show_level.ONLY_NORMAL
};

// Xdrip modified to put ExternalStatusService.getLastStatusLineTime()
export const AAPS_TIME_TEXT = {
    x: px(27),
    y: px(316),
    w: px(129),
    h: px(27),
    color: Colors.defaultTransparent,
    text_size: px(24),
    align_h: hmUI.align.CENTER_H,
    align_v: hmUI.align.CENTER_V,
    text_style: hmUI.text_style.NONE,
    show_level: hmUI.show_level.ONLY_NORMAL
};

export const PHONE_BATTERY_TEXT = {
    x: px(150),
    y: px(264),
    w: px(36),
    h: px(25),
    color: Colors.white,
    text_size: px(18),
    align_h: hmUI.align.LEFT,
    align_v: hmUI.align.TOP,
    text_style: hmUI.text_style.NONE,
    show_level: hmUI.show_level.ONLY_NORMAL
};

export const WATCH_BATTERY_TEXT = {
    x: px(7),
    y: px(264),
    w: px(36),
    h: px(25),
    color: Colors.white,
    text_size: px(18),
    align_h: hmUI.align.RIGHT,
    align_v: hmUI.align.TOP,
    text_style: hmUI.text_style.NONE,
    show_level: hmUI.show_level.ONLY_NORMAL
};

export const BG_STATUS_LOW_IMG = {
    x: px(44),
    y: px(105),
    src: 'nightscout/bgLow.png',
    show_level: hmUI.show_level.ONLY_NORMAL
};

export const BG_STATUS_OK_IMG = {
    x: px(64),
    y: px(105),
    src: 'nightscout/bgOk.png',
    show_level: hmUI.show_level.ONLY_NORMAL
};

export const BG_STATUS_HIGH_IMG = {
    x: px(142),
    y: px(105),
    src: 'nightscout/bgHigh.png',
    show_level: hmUI.show_level.ONLY_NORMAL
};

export const IMG_STATUS_BT_DISCONNECTED = {
    x: px(16),
    y: px(27),
    src: img('status/bt_disconnect.png'),
    type: hmUI.system_status.DISCONNECT,
    show_level: hmUI.show_level.ONLY_NORMAL
};

export const IMG_LOADING_PROGRESS = {
    x: px(83),
    y: px(188),
    src: 'nightscout/progress.png',
    angle: 0,
    center_x: 20,
    center_y: 20,
    visible: false,
    show_level: hmUI.show_level.ONLY_NORMAL
};


// 100% edit mask
export const EDIT_MASK_100 = {
    x: px(0),
    y: px(0),
    w: px(194),
    h: px(368),
    src: img('mask/mask100.png'),
    show_level: hmUI.show_level.ONLY_EDIT
};

// 70% edit mask
export const EDIT_MASK_70 = {
    x: px(0),
    y: px(0),
    w: px(194),
    h: px(368),
    src: img('mask/mask70.png'),
    show_level: hmUI.show_level.ONLY_EDIT
};


// BEGIN edit group treatments aaps/xdrip data
export const CUSTOM_WIDGETS = {
    NONE: 100001,
    NIGHTSCOUT: 100002,
    AAPS: 100003
};

export const EDIT_GROUP_AAPS_NIGHTSCOUT = {
    edit_id: 105,
    x: px(27),
    y: px(288),
    w: px(129),
    h: px(52),
    select_image: img('mask/select-wide.png'),
    un_select_image: img('mask/un_select-wide.png'),
    optional_types: [
        {
            type: CUSTOM_WIDGETS.NIGHTSCOUT,
            title_sc: 'Nightscout+ default treatments data',
            title_tc: 'Nightscout+ default treatments data',
            title_en: 'Nightscout+ default treatments data',
            preview: img('widgets/xdrip.png')
        },
        {
            type: CUSTOM_WIDGETS.AAPS,
            title_sc: 'AAPS IOB/COB data (requires modified Nightscout+)',
            title_tc: 'AAPS IOB/COB data (requires modified Nightscout+)',
            title_en: 'AAPS IOB/COB data (requires modified Nightscout+)',
            preview: img('widgets/aaps.png')
        },
        // custom empty widget, nothing is rendered
        {
            type: CUSTOM_WIDGETS.NONE,
            title_sc: 'None (empty space)',
            title_tc: 'None (empty space)',
            title_en: 'None (empty space)',
            preview: img('widgets/empty.png')
        }
    ],
    count: 3,
    default_type: CUSTOM_WIDGETS.NIGHTSCOUT,
    tips_BG: img('mask/text_tag-wide.png'),
    tips_width: 300,
    tips_margin: 10, // optional, default value: 0,
    tips_x: -32,
    tips_y: -45,
    show_level: hmUI.show_level.ONLY_NORMAL | hmUI.show_level.ONLY_EDIT
};
// END edit group treatments aaps/xdrip data


// BEGIN edit group default styles
const editWidgetW = 90;
const editWidgetH = 70;
const editWidgetIconHeight = 40;
const editWidgetIconWidth = 40;
const editWidgetIconMargin = 7;
const editWidgetArcRadius = 16;
const editWidgetArcLineWidth = 8;
const editWidgetArcMarginX = 3;
const editWidgetArcMarginTop = 0;

const editGroupTypes = [
    {
        type: hmUI.edit_type.HEART,
        preview: img('widgets/heart/heart.png')
    },
    {
        type: hmUI.edit_type.SPO2,
        preview: img('widgets/spo2.png')
    },
    {
        type: hmUI.edit_type.STEP,
        preview: img('widgets/steps/steps.png')
    },
    {
        type: hmUI.edit_type.DISTANCE,
        preview: img('widgets/distance.png')
    },
    {
        type: hmUI.edit_type.CAL,
        preview: img('widgets/calories/calories.png')
    },
    {
        type: hmUI.edit_type.STAND,
        preview: img('widgets/stand/stand.png')
    },
    {
        type: hmUI.edit_type.PAI_DAILY,
        preview: img('widgets/pai/pai.png')
    },
    {
        type: hmUI.edit_type.WEATHER,
        preview: img('widgets/temp.png')
    },
    {
        type: hmUI.edit_type.HUMIDITY,
        preview: img('widgets/humidity/humidity.png')
    },
    {
        type: hmUI.edit_type.ALTIMETER,
        preview: img('widgets/air-pressure.png')
    },
    {
        type: hmUI.edit_type.UVI,
        preview: img('widgets/uvi/uvi.png')
    },
    {
        type: hmUI.edit_type.AQI,
        preview: img('widgets/aqi.png')
    },
    {
        type: hmUI.edit_type.MOON,
        preview: img('widgets/moon.png')
    },
    // custom empty widget, nothing is rendered
    {
        type: CUSTOM_WIDGETS.NONE,
        title_sc: 'None (empty space)',
        title_tc: 'None (empty space)',
        title_en: 'None (empty space)',
        preview: img('widgets/empty.png')
    }
];

export const EDIT_GROUP_DEFAULTS = {
    w: px(editWidgetW),
    h: px(editWidgetH),
    select_image: img('mask/select.png'),
    un_select_image: img('mask/un_select.png'),
    optional_types: editGroupTypes,
    count: editGroupTypes.length,
    tips_BG: img('mask/text_tag.png'),
    tips_width: 110,
    tips_margin: 10, // optional, default value: 0
    show_level: hmUI.show_level.ONLY_NORMAL | hmUI.show_level.ONLY_EDIT
};

// Default styles for all IMG widgets 
export const EDIT_DEFAULT_IMG = {
    // TODO: make images full width and remove this
    w: px(editWidgetW), // full width to center
    show_level: hmUI.show_level.ONLY_NORMAL
};

// Default styles for all ARC_PROGRESS Left widgets
const EDIT_DEFAULT_ARC_PROGRESS_LEFT = {

};
// Default styles for all ARC_PROGRESS RIGHT widgets
const EDIT_DEFAULT_ARC_PROGRESS_RIGHT = {

};

export const EDIT_DEFAULT_ARC_PROGRESS = {

};

// Default styles for all TEXT_IMG widgets
export const EDIT_DEFAULT_TEXT_IMG = {
    w: px(editWidgetW),
    padding: false,
    h_space: 1,
    align_h: hmUI.align.CENTER_H,
    show_level: hmUI.show_level.ONLY_NORMAL,
    font_array: smallNumArr,
    dot_image: img('smallNum/d.png'),
    negative_image: img('smallNum/negative_image.png')
};
// END edit group default styles


// BEGIN Top Left Edit Widgets
const topLeftX = 9;
const topLeftY = 105;

export const EDIT_TOP_LEFT_GROUP = {

}; 

// Styles for all Top Left IMG widgets
export const EDIT_TL_IMG = {


};

// Styles for all Top Left ARC_PROGRESS widgets
const EDIT_TL_ARC_PROGRESS_LEFT = {


};
// Styles for all Top Left ARC_PROGRESS Right widgets
const EDIT_TL_ARC_PROGRESS_RIGHT = {


};
export const EDIT_TL_ARC_PROGRESS = {
 

};

// Styles for all Top Left TEXT_IMG widgets
export const EDIT_TL_TEXT_IMG = {


};
// END Top Left Edit Widgets


// BEGIN Top Right Edit Widgets
const topRightX = 310;
const topRightY = 124;

export const EDIT_TOP_RIGHT_GROUP = {


}; 

// Default styles for all Top Right IMG widgets
export const EDIT_TR_IMG = {


};

// Styles for all Top Right ARC_PROGRESS widgets
const EDIT_TR_ARC_PROGRESS_LEFT = {


};
// Styles for all Top Right ARC_PROGRESS Right widgets
const EDIT_TR_ARC_PROGRESS_RIGHT = {


};
export const EDIT_TR_ARC_PROGRESS = {

};

// Styles for all Top Right TEXT_IMG widgets
export const EDIT_TR_TEXT_IMG = {


};
// END Top Right Edit Widgets


// BEGIN Bottom Left Edit Widgets
const bottomLeftX = 19;
const bottomLeftY = 211;

export const EDIT_BOTTOM_LEFT_GROUP = {


}; 

// Styles for all Bottom Left IMG widgets
export const EDIT_BL_IMG = {


};

// Styles for all Bottom Left ARC_PROGRESS widgets
const EDIT_BL_ARC_PROGRESS_LEFT = {
 

};
// Styles for all Bottom Left ARC_PROGRESS Right widgets
const EDIT_BL_ARC_PROGRESS_RIGHT = {


};
export const EDIT_BL_ARC_PROGRESS = {


};

// Styles for all Bottom Left TEXT_IMG widgets
export const EDIT_BL_TEXT_IMG = {


};
// END Bottom Left Edit Widgets


// BEGIN Bottom Right Edit Widgets
const bottomRightX = 144;
const bottomRightY = 300;


export const EDIT_BOTTOM_RIGHT_GROUP = {


}; 

// Styles for all Bottom Right IMG widgets
export const EDIT_BR_IMG = {

};

// Styles for all Bottom Right ARC_PROGRESS widgets
const EDIT_BR_ARC_PROGRESS_LEFT = {


};
// Styles for all Bottom Right ARC_PROGRESS Right widgets
const EDIT_BR_ARC_PROGRESS_RIGHT = {


};
export const EDIT_BR_ARC_PROGRESS = {


};

// Styles for all Bottom Right TEXT_IMG widgets
export const EDIT_BR_TEXT_IMG = {


};
// END Bottom Right Edit Widgets


// BEGIN Edit Widgets
// These styles are merged with the above default styles.
// HEART widget
export const EDIT_HEART_IMG = {
    src: img('widgets/heart/heart-base.png') // 90x40px
};
export const EDIT_HEART_IMG_LEVEL = {
    image_array: heartArr, // 90x40px
    image_length: heartArr.length,
    type: hmUI.data_type.HEART
    //level: 3
};
export const EDIT_HEART_TEXT_IMG = {
    type: hmUI.data_type.HEART
};

// STEP widget
export const EDIT_STEP_IMG = {
    src: img('widgets/steps/steps-base.png') // 90x40px 
};
export const EDIT_STEP_ARC_PROGRESS = {
    type: hmUI.data_type.STEP,
    //level: 75
};
export const EDIT_STEP_TEXT_IMG = {
    type: hmUI.data_type.STEP
};

// DISTANCE widget
export const EDIT_DISTANCE_IMG = {
    src: img('widgets/distance.png'), // 40x40px
    pos_x: px((editWidgetW - editWidgetIconWidth) / 2) // center the image
};
export const EDIT_DISTANCE_TEXT_IMG = {
    type: hmUI.data_type.DISTANCE,
    unit_sc: img('smallNum/unit-distance-metric.png'),
    unit_tc: img('smallNum/unit-distance-metric.png'),
    unit_en: img('smallNum/unit-distance-metric.png'),
    imperial_unit_sc: img('smallNum/unit-distance-imperial.png'),
    imperial_unit_tc: img('smallNum/unit-distance-imperial.png'),
    imperial_unit_en: img('smallNum/unit-distance-imperial.png'),
    align_h: hmUI.align.LEFT  // override alignment because of unit
};

// WEATHER widget
export const EDIT_WEATHER_CONDITION_IMG_LEVEL = {
    image_array: weatherArr, // 90x40px
    image_length: weatherArr.length,
    type: hmUI.data_type.WEATHER
};
export const EDIT_WEATHER_CURRENT_TEXT_IMG = {
    type: hmUI.data_type.WEATHER_CURRENT,
    unit_sc: img('smallNum/unit-temperature-metric.png'),
    unit_tc: img('smallNum/unit-temperature-metric.png'),
    unit_en: img('smallNum/unit-temperature-metric.png'),
    imperial_unit_sc: img('smallNum/unit-temperature-imperial.png'),
    imperial_unit_tc: img('smallNum/unit-temperature-imperial.png'),
    imperial_unit_en: img('smallNum/unit-temperature-imperial.png')
};

// PAI widget
export const EDIT_PAI_IMG = {
    src: img('widgets/pai/pai-base.png') // 90x40px
};
export const EDIT_PAI_ARC_PROGRESS = {
    type: hmUI.data_type.PAI_DAILY
};
export const EDIT_PAI_TEXT_IMG = {
    type: hmUI.data_type.PAI_DAILY
};

// UVI widget
export const EDIT_UVI_IMG = {
    src: img('widgets/uvi/uvi-base.png') // 90x40px
};
export const EDIT_UVI_ARC_PROGRESS = {
    type: hmUI.data_type.UVI
};
export const EDIT_UVI_TEXT_IMG = {
    type: hmUI.data_type.UVI
};

// ALTIMETER widget
export const EDIT_ALTIMETER_IMG = {
    src: img('widgets/air-pressure.png'), // 40x40px
    pos_x: px((editWidgetW - editWidgetIconWidth) / 2) // center the image
};
export const EDIT_ALTIMETER_TEXT_IMG = {
    type: hmUI.data_type.ALTIMETER,
    unit_sc: img('smallNum/unit-pressure-metric.png'),
    unit_tc: img('smallNum/unit-pressure-metric.png'),
    unit_en: img('smallNum/unit-pressure-metric.png'),
    imperial_unit_sc: img('smallNum/unit-pressure-imperial.png'),
    imperial_unit_tc: img('smallNum/unit-pressure-imperial.png'),
    imperial_unit_en: img('smallNum/unit-pressure-imperial.png'),
    align_h: hmUI.align.LEFT  // override alignment because of unit
};

// MOON widget
export const EDIT_MOON_IMG_LEVEL = {
    image_array: moonArr, // 90x70px
    image_length: moonArr.length,
    type: hmUI.data_type.WEATHER
};

// CAL widget
export const EDIT_CAL_IMG = {
    src: img('widgets/calories/calories-base.png') // 90x40px
};
export const EDIT_CAL_ARC_PROGRESS = {
    type: hmUI.data_type.CAL
};
export const EDIT_CAL_TEXT_IMG = {
    type: hmUI.data_type.CAL,
    unit_sc: img('smallNum/unit-calories.png'),
    unit_tc: img('smallNum/unit-calories.png'),
    unit_en: img('smallNum/unit-calories.png'),
    imperial_unit_sc: img('smallNum/unit-calories.png'),
    imperial_unit_tc: img('smallNum/unit-calories.png'),
    imperial_unit_en: img('smallNum/unit-calories.png'),
    align_h: hmUI.align.LEFT  // override alignment because of unit
};

// AQI widget
export const EDIT_AQI_IMG = {
    src: img('widgets/aqi.png'), // 40x40px
    pos_x: px((editWidgetW - editWidgetIconWidth) / 2) // center the image
};
export const EDIT_AQI_TEXT_IMG = {
    type: hmUI.data_type.AQI
};

// SPO2 widget
export const EDIT_SPO2_IMG = {
    src: img('widgets/spo2.png'), // 40x40px
    pos_x: px((editWidgetW - editWidgetIconWidth) / 2) // center the image
};
export const EDIT_SPO2_TEXT_IMG = {
    type: hmUI.data_type.SPO2,
    unit_sc: img('smallNum/unit-percent.png'),
    unit_tc: img('smallNum/unit-percent.png'),
    unit_en: img('smallNum/unit-percent.png'),
    imperial_unit_sc: img('smallNum/unit-percent.png'),
    imperial_unit_tc: img('smallNum/unit-percent.png'),
    imperial_unit_en: img('smallNum/unit-percent.png')
};

// STAND widget
export const EDIT_STAND_IMG = {
    src: img('widgets/stand/stand-base.png') // 90x40px
};
export const EDIT_STAND_ARC_PROGRESS = {
    type: hmUI.data_type.STAND
};
export const EDIT_STAND_TEXT_IMG = {
    type: hmUI.data_type.STAND,
    dot_image: img('smallNum/slash.png')
};

// HUMIDITY widget
export const EDIT_HUMIDITY_IMG = {
    src: img('widgets/humidity/humidity-base.png') // 90x40px
};
export const EDIT_HUMIDITY_ARC_PROGRESS = {
    type: hmUI.data_type.HUMIDITY
};
export const EDIT_HUMIDITY_TEXT_IMG = {
    type: hmUI.data_type.HUMIDITY,
    unit_sc: img('smallNum/unit-percent.png'),
    unit_tc: img('smallNum/unit-percent.png'),
    unit_en: img('smallNum/unit-percent.png'),
    imperial_unit_sc: img('smallNum/unit-percent.png'),
    imperial_unit_tc: img('smallNum/unit-percent.png'),
    imperial_unit_en: img('smallNum/unit-percent.png')
};
// END Edit Widgets
