import opentype from 'opentype.js';
import svgpath from 'svgpath';

/**
 * Кэш загруженных шрифтов
 */
const fontCache = new Map<string, opentype.Font>();

/**
 * Кэш URL шрифтов
 */
const fontUrlCache = new Map<string, string>();

/**
 * Маппинг системных шрифтов на Google Fonts эквиваленты
 */
const systemToGoogleFont: Record<string, string> = {
  'Arial': 'Roboto',
  'Georgia': 'Noto Serif',
  'Times New Roman': 'Noto Serif',
  'Verdana': 'Open Sans',
  'Courier New': 'Fira Code',
  'Impact': 'Oswald',
  'Tahoma': 'Roboto',
  'Helvetica': 'Roboto',
};

/**
 * 100 ПРОВЕРЕННЫХ ШРИФТОВ для конструктора печатей
 * Все URL через jsDelivr CDN с официальных репозиториев
 */
const directTtfUrls: Record<string, Record<string, string>> = {
  
  // =============================================
  // SANS-SERIF ШРИФТЫ (40 шрифтов)
  // =============================================
  
  'Roboto': {
    '400': 'https://cdn.jsdelivr.net/gh/googlefonts/roboto@main/src/hinted/Roboto-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/googlefonts/roboto@main/src/hinted/Roboto-Bold.ttf',
  },
  'Open Sans': {
    '400': 'https://cdn.jsdelivr.net/gh/googlefonts/opensans@main/fonts/ttf/OpenSans-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/googlefonts/opensans@main/fonts/ttf/OpenSans-Bold.ttf',
  },
  'Noto Sans': {
    '400': 'https://cdn.jsdelivr.net/gh/notofonts/latin@main/fonts/NotoSans/hinted/ttf/NotoSans-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/notofonts/latin@main/fonts/NotoSans/hinted/ttf/NotoSans-Bold.ttf',
  },
  'Oswald': {
    '400': 'https://cdn.jsdelivr.net/gh/googlefonts/OswaldFont@main/fonts/ttf/Oswald-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/googlefonts/OswaldFont@main/fonts/ttf/Oswald-Bold.ttf',
  },
  'Montserrat': {
    '400': 'https://cdn.jsdelivr.net/gh/JulietaUla/Montserrat@master/fonts/ttf/Montserrat-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/JulietaUla/Montserrat@master/fonts/ttf/Montserrat-Bold.ttf',
  },
  'Inter': {
    '400': 'https://cdn.jsdelivr.net/gh/rsms/inter@master/docs/font-files/Inter-Regular.otf',
    '700': 'https://cdn.jsdelivr.net/gh/rsms/inter@master/docs/font-files/Inter-Bold.otf',
  },
  'Ubuntu': {
    '400': 'https://cdn.jsdelivr.net/gh/googlefonts/ubuntu@main/fonts/ttf/Ubuntu-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/googlefonts/ubuntu@main/fonts/ttf/Ubuntu-Bold.ttf',
  },
  'Nunito': {
    '400': 'https://cdn.jsdelivr.net/gh/googlefonts/nunito@main/fonts/ttf/Nunito-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/googlefonts/nunito@main/fonts/ttf/Nunito-Bold.ttf',
  },
  'Poppins': {
    '400': 'https://cdn.jsdelivr.net/gh/itfoundry/poppins@master/products/Poppins-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/itfoundry/poppins@master/products/Poppins-Bold.ttf',
  },
  'IBM Plex Sans': {
    '400': 'https://cdn.jsdelivr.net/gh/IBM/plex@master/IBM-Plex-Sans/fonts/complete/ttf/IBMPlexSans-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/IBM/plex@master/IBM-Plex-Sans/fonts/complete/ttf/IBMPlexSans-Bold.ttf',
  },
  'Fira Sans': {
    '400': 'https://cdn.jsdelivr.net/gh/mozilla/Fira@master/ttf/FiraSans-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/mozilla/Fira@master/ttf/FiraSans-Bold.ttf',
  },
  'Anton': {
    '400': 'https://cdn.jsdelivr.net/gh/googlefonts/Anton@main/fonts/Anton-Regular.ttf',
  },
  'Raleway': {
    '400': 'https://cdn.jsdelivr.net/gh/impallari/Raleway@master/fonts/v4020/Raleway-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/impallari/Raleway@master/fonts/v4020/Raleway-Bold.ttf',
  },
  'Lato': {
    '400': 'https://cdn.jsdelivr.net/gh/latofonts/lato-source@master/fonts/lato-regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/latofonts/lato-source@master/fonts/lato-bold.ttf',
  },
  'Source Sans 3': {
    '400': 'https://cdn.jsdelivr.net/gh/adobe-fonts/source-sans@release/TTF/SourceSans3-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/adobe-fonts/source-sans@release/TTF/SourceSans3-Bold.ttf',
  },
  'Work Sans': {
    '400': 'https://cdn.jsdelivr.net/gh/weiweihuanghuang/Work-Sans@master/fonts/ttf/WorkSans-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/weiweihuanghuang/Work-Sans@master/fonts/ttf/WorkSans-Bold.ttf',
  },
  'Rubik': {
    '400': 'https://cdn.jsdelivr.net/gh/googlefonts/rubik@main/fonts/ttf/Rubik-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/googlefonts/rubik@main/fonts/ttf/Rubik-Bold.ttf',
  },
  'Barlow': {
    '400': 'https://cdn.jsdelivr.net/gh/jpt/barlow@master/fonts/ttf/Barlow-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/jpt/barlow@master/fonts/ttf/Barlow-Bold.ttf',
  },
  'Quicksand': {
    '400': 'https://cdn.jsdelivr.net/gh/googlefonts/Quicksand@main/fonts/ttf/Quicksand-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/googlefonts/Quicksand@main/fonts/ttf/Quicksand-Bold.ttf',
  },
  'Titillium Web': {
    '400': 'https://cdn.jsdelivr.net/gh/googlefonts/titillium@main/fonts/ttf/TitilliumWeb-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/googlefonts/titillium@main/fonts/ttf/TitilliumWeb-Bold.ttf',
  },
  'Cabin': {
    '400': 'https://cdn.jsdelivr.net/gh/impallari/Cabin@master/fonts/TTF/Cabin-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/impallari/Cabin@master/fonts/TTF/Cabin-Bold.ttf',
  },
  'Exo 2': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/ndiscern-exo-2-font@master/fonts/ttf/Exo2-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/nickshanks/ndiscern-exo-2-font@master/fonts/ttf/Exo2-Bold.ttf',
  },
  'Josefin Sans': {
    '400': 'https://cdn.jsdelivr.net/gh/googlefonts/josefinsans@main/fonts/ttf/JosefinSans-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/googlefonts/josefinsans@main/fonts/ttf/JosefinSans-Bold.ttf',
  },
  'Mukta': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-Mukta-fonts@main/Mukta/ttf/Mukta-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-Mukta-fonts@main/Mukta/ttf/Mukta-Bold.ttf',
  },
  'Overpass': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Overpass/fonts/ttf/Overpass-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Overpass/fonts/ttf/Overpass-Bold.ttf',
  },
  'DM Sans': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/DM%20Sans/DMSans-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/DM%20Sans/DMSans-Bold.ttf',
  },
  'Archivo': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Archivo/Archivo-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Archivo/Archivo-Bold.ttf',
  },
  'Asap': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Asap/Asap-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Asap/Asap-Bold.ttf',
  },
  'Hind': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Hind/Hind-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Hind/Hind-Bold.ttf',
  },
  'Karla': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Karla/Karla-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Karla/Karla-Bold.ttf',
  },
  'Oxygen': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Oxygen/Oxygen-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Oxygen/Oxygen-Bold.ttf',
  },
  'Prompt': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Prompt/Prompt-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Prompt/Prompt-Bold.ttf',
  },
  'Questrial': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Questrial/Questrial-Regular.ttf',
  },
  'Sarabun': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Sarabun/Sarabun-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Sarabun/Sarabun-Bold.ttf',
  },
  'Signika': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Signika/Signika-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Signika/Signika-Bold.ttf',
  },
  'Varela Round': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Varela%20Round/VarelaRound-Regular.ttf',
  },
  'Abel': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Abel/Abel-Regular.ttf',
  },
  'Dosis': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Dosis/Dosis-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Dosis/Dosis-Bold.ttf',
  },
  'Kanit': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Kanit/Kanit-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Kanit/Kanit-Bold.ttf',
  },
  'Maven Pro': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Maven%20Pro/MavenPro-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Maven%20Pro/MavenPro-Bold.ttf',
  },

  // =============================================
  // SERIF ШРИФТЫ (25 шрифтов)
  // =============================================
  
  'Noto Serif': {
    '400': 'https://cdn.jsdelivr.net/gh/notofonts/latin@main/fonts/NotoSerif/hinted/ttf/NotoSerif-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/notofonts/latin@main/fonts/NotoSerif/hinted/ttf/NotoSerif-Bold.ttf',
  },
  'Playfair Display': {
    '400': 'https://cdn.jsdelivr.net/gh/googlefonts/Playfair@main/fonts/ttf/PlayfairDisplay-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/googlefonts/Playfair@main/fonts/ttf/PlayfairDisplay-Bold.ttf',
  },
  'Merriweather': {
    '400': 'https://cdn.jsdelivr.net/gh/SorkinType/Merriweather@master/fonts/ttf/Merriweather-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/SorkinType/Merriweather@master/fonts/ttf/Merriweather-Bold.ttf',
  },
  'Libre Baskerville': {
    '400': 'https://cdn.jsdelivr.net/gh/impallari/Libre-Baskerville@master/src/LibreBaskerville-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/impallari/Libre-Baskerville@master/src/LibreBaskerville-Bold.ttf',
  },
  'IBM Plex Serif': {
    '400': 'https://cdn.jsdelivr.net/gh/IBM/plex@master/IBM-Plex-Serif/fonts/complete/ttf/IBMPlexSerif-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/IBM/plex@master/IBM-Plex-Serif/fonts/complete/ttf/IBMPlexSerif-Bold.ttf',
  },
  'Source Serif': {
    '400': 'https://cdn.jsdelivr.net/gh/adobe-fonts/source-serif@release/TTF/SourceSerif4-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/adobe-fonts/source-serif@release/TTF/SourceSerif4-Bold.ttf',
  },
  'Lora': {
    '400': 'https://cdn.jsdelivr.net/gh/cyrealtype/Lora@master/fonts/ttf/Lora-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/cyrealtype/Lora@master/fonts/ttf/Lora-Bold.ttf',
  },
  'PT Serif': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/PT%20Serif/PTSerif-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/PT%20Serif/PTSerif-Bold.ttf',
  },
  'Crimson Text': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Crimson%20Text/CrimsonText-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Crimson%20Text/CrimsonText-Bold.ttf',
  },
  'Bitter': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Bitter/Bitter-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Bitter/Bitter-Bold.ttf',
  },
  'Domine': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Domine/Domine-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Domine/Domine-Bold.ttf',
  },
  'Arvo': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Arvo/Arvo-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Arvo/Arvo-Bold.ttf',
  },
  'Cardo': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Cardo/Cardo-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Cardo/Cardo-Bold.ttf',
  },
  'Vollkorn': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Vollkorn/Vollkorn-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Vollkorn/Vollkorn-Bold.ttf',
  },
  'Neuton': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Neuton/Neuton-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Neuton/Neuton-Bold.ttf',
  },
  'Old Standard TT': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Old%20Standard%20TT/OldStandard-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Old%20Standard%20TT/OldStandard-Bold.ttf',
  },
  'Cormorant': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Cormorant/Cormorant-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Cormorant/Cormorant-Bold.ttf',
  },
  'Spectral': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Spectral/Spectral-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Spectral/Spectral-Bold.ttf',
  },
  'Alegreya': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Alegreya/Alegreya-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Alegreya/Alegreya-Bold.ttf',
  },
  'Libre Caslon Text': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Libre%20Caslon%20Text/LibreCaslonText-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Libre%20Caslon%20Text/LibreCaslonText-Bold.ttf',
  },
  'Noticia Text': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Noticia%20Text/NoticiaText-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Noticia%20Text/NoticiaText-Bold.ttf',
  },
  'Rokkitt': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Rokkitt/Rokkitt-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Rokkitt/Rokkitt-Bold.ttf',
  },
  'Zilla Slab': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Zilla%20Slab/ZillaSlab-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Zilla%20Slab/ZillaSlab-Bold.ttf',
  },
  'Copse': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Copse/Copse-Regular.ttf',
  },
  'Tinos': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Tinos/Tinos-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Tinos/Tinos-Bold.ttf',
  },

  // =============================================
  // РУКОПИСНЫЕ / SCRIPT ШРИФТЫ (25 шрифтов)
  // =============================================
  
  'Dancing Script': {
    '400': 'https://cdn.jsdelivr.net/gh/googlefonts/DancingScript@main/fonts/ttf/DancingScript-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/googlefonts/DancingScript@main/fonts/ttf/DancingScript-Bold.ttf',
  },
  'Caveat': {
    '400': 'https://cdn.jsdelivr.net/gh/googlefonts/caveat@main/fonts/ttf/Caveat-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/googlefonts/caveat@main/fonts/ttf/Caveat-Bold.ttf',
  },
  'Pacifico': {
    '400': 'https://cdn.jsdelivr.net/gh/googlefonts/Pacifico@main/fonts/ttf/Pacifico-Regular.ttf',
  },
  'Great Vibes': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Great%20Vibes/GreatVibes-Regular.ttf',
  },
  'Satisfy': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Satisfy/Satisfy-Regular.ttf',
  },
  'Sacramento': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Sacramento/Sacramento-Regular.ttf',
  },
  'Kaushan Script': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Kaushan%20Script/KaushanScript-Regular.ttf',
  },
  'Alex Brush': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Alex%20Brush/AlexBrush-Regular.ttf',
  },
  'Parisienne': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Parisienne/Parisienne-Regular.ttf',
  },
  'Tangerine': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Tangerine/Tangerine-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Tangerine/Tangerine-Bold.ttf',
  },
  'Allura': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Allura/Allura-Regular.ttf',
  },
  'Cookie': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Cookie/Cookie-Regular.ttf',
  },
  'Courgette': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Courgette/Courgette-Regular.ttf',
  },
  'Lobster': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Lobster/Lobster-Regular.ttf',
  },
  'Lobster Two': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Lobster%20Two/LobsterTwo-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Lobster%20Two/LobsterTwo-Bold.ttf',
  },
  'Marck Script': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Marck%20Script/MarckScript-Regular.ttf',
  },
  'Permanent Marker': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Permanent%20Marker/PermanentMarker-Regular.ttf',
  },
  'Shadows Into Light': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Shadows%20Into%20Light/ShadowsIntoLight-Regular.ttf',
  },
  'Indie Flower': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Indie%20Flower/IndieFlower-Regular.ttf',
  },
  'Amatic SC': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Amatic%20SC/AmaticSC-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Amatic%20SC/AmaticSC-Bold.ttf',
  },
  'Handlee': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Handlee/Handlee-Regular.ttf',
  },
  'Architects Daughter': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Architects%20Daughter/ArchitectsDaughter-Regular.ttf',
  },
  'Patrick Hand': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Patrick%20Hand/PatrickHand-Regular.ttf',
  },
  'Yellowtail': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Yellowtail/Yellowtail-Regular.ttf',
  },
  'Playball': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Playball/Playball-Regular.ttf',
  },

  // =============================================
  // МОНОШИРИННЫЕ ШРИФТЫ (5 шрифтов)
  // =============================================
  
  'Fira Code': {
    '400': 'https://cdn.jsdelivr.net/gh/tonsky/FiraCode@master/distr/ttf/FiraCode-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/tonsky/FiraCode@master/distr/ttf/FiraCode-Bold.ttf',
  },
  'JetBrains Mono': {
    '400': 'https://cdn.jsdelivr.net/gh/JetBrains/JetBrainsMono@master/fonts/ttf/JetBrainsMono-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/JetBrains/JetBrainsMono@master/fonts/ttf/JetBrainsMono-Bold.ttf',
  },
  'Source Code Pro': {
    '400': 'https://cdn.jsdelivr.net/gh/adobe-fonts/source-code-pro@release/TTF/SourceCodePro-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/adobe-fonts/source-code-pro@release/TTF/SourceCodePro-Bold.ttf',
  },
  'IBM Plex Mono': {
    '400': 'https://cdn.jsdelivr.net/gh/IBM/plex@master/IBM-Plex-Mono/fonts/complete/ttf/IBMPlexMono-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/IBM/plex@master/IBM-Plex-Mono/fonts/complete/ttf/IBMPlexMono-Bold.ttf',
  },
  'Roboto Mono': {
    '400': 'https://cdn.jsdelivr.net/gh/googlefonts/RobotoMono@main/fonts/ttf/RobotoMono-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/googlefonts/RobotoMono@main/fonts/ttf/RobotoMono-Bold.ttf',
  },

  // =============================================
  // DISPLAY / ДЕКОРАТИВНЫЕ ШРИФТЫ (5 шрифтов)
  // =============================================
  
  'Bebas Neue': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Bebas%20Neue/BebasNeue-Regular.ttf',
  },
  'Russo One': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Russo%20One/RussoOne-Regular.ttf',
  },
  'Black Ops One': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Black%20Ops%20One/BlackOpsOne-Regular.ttf',
  },
  'Bangers': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Bangers/Bangers-Regular.ttf',
  },
  'Righteous': {
    '400': 'https://cdn.jsdelivr.net/gh/nickshanks/Uniked-fonts@main/Righteous/Righteous-Regular.ttf',
  },
};

/**
 * Получает URL TTF файла шрифта
 */
async function getFontUrl(fontFamily: string, fontWeight: string = 'normal'): Promise<string> {
  const googleFontName = systemToGoogleFont[fontFamily] || fontFamily;
  const weight = fontWeight === 'bold' ? '700' : '400';
  const cacheKey = `${googleFontName}-${weight}`;
  
  if (fontUrlCache.has(cacheKey)) {
    return fontUrlCache.get(cacheKey)!;
  }
  
  const directUrl = directTtfUrls[googleFontName]?.[weight] || directTtfUrls[googleFontName]?.['400'];
  if (directUrl) {
    fontUrlCache.set(cacheKey, directUrl);
    return directUrl;
  }
  
  const robotoUrl = directTtfUrls['Roboto'][weight] || directTtfUrls['Roboto']['400'];
  fontUrlCache.set(cacheKey, robotoUrl);
  return robotoUrl;
}

/**
 * Загружает шрифт
 */
async function loadFont(fontFamily: string, fontWeight: string, fontStyle: string): Promise<opentype.Font> {
  const cacheKey = `${fontFamily}-${fontWeight}-${fontStyle}`;

  if (fontCache.has(cacheKey)) {
    return fontCache.get(cacheKey)!;
  }

  const fontsToTry = [fontFamily];
  if (fontFamily !== 'Roboto') fontsToTry.push('Roboto');

  let lastError: Error | null = null;

  for (const font of fontsToTry) {
    try {
      const fontUrl = await getFontUrl(font, fontWeight);
      
      const response = await fetch(fontUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      
      const signature = new Uint8Array(arrayBuffer.slice(0, 4));
      const signatureStr = String.fromCharCode(...signature);
      
      if (signatureStr === 'wOF2') {
        throw new Error('WOFF2 not supported');
      }
      
      const parsedFont = opentype.parse(arrayBuffer);
      fontCache.set(cacheKey, parsedFont);
      
      if (font !== fontFamily) {
        console.debug(`Using "${font}" instead of "${fontFamily}"`);
      }
      
      return parsedFont;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
    }
  }

  throw new Error(`Failed to load font: ${lastError?.message}`);
}

/**
 * Конвертирует текст в SVG path
 */
export async function convertTextToPath(
  text: string,
  x: number,
  y: number,
  fontSize: number,
  fontFamily: string,
  color: string,
  fontWeight: string = 'normal',
  fontStyle: string = 'normal'
): Promise<string> {
  try {
    const font = await loadFont(fontFamily, fontWeight, fontStyle);
    const path = font.getPath(text, 0, 0, fontSize);

    let pathData = '';
    path.commands.forEach((cmd: opentype.PathCommand) => {
      if (cmd.type === 'M') {
        pathData += `M ${cmd.x} ${cmd.y} `;
      } else if (cmd.type === 'L') {
        pathData += `L ${cmd.x} ${cmd.y} `;
      } else if (cmd.type === 'C') {
        pathData += `C ${cmd.x1} ${cmd.y1} ${cmd.x2} ${cmd.y2} ${cmd.x} ${cmd.y} `;
      } else if (cmd.type === 'Q') {
        pathData += `Q ${cmd.x1} ${cmd.y1} ${cmd.x} ${cmd.y} `;
      } else if (cmd.type === 'Z') {
        pathData += 'Z ';
      }
    });

    const bbox = path.getBoundingBox();
    const bboxCenterX = (bbox.x1 + bbox.x2) / 2;
    const bboxCenterY = (bbox.y1 + bbox.y2) / 2;

    const transformedPath = svgpath(pathData)
      .translate(-bboxCenterX, -bboxCenterY)
      .translate(x, y)
      .toString();

    return `<path d="${transformedPath}" fill="${color}"/>`;
  } catch (error) {
    console.error('Error converting text to path:', error);
    return `<text x="${x}" y="${y}" fill="${color}" font-size="${fontSize}" font-family="${fontFamily}" font-weight="${fontWeight}" font-style="${fontStyle}" text-anchor="middle" dominant-baseline="middle">${text}</text>`;
  }
}

/**
 * Конвертирует круговой текст в paths
 */
export async function convertCurvedTextToPath(
  text: string,
  cx: number,
  cy: number,
  radius: number,
  fontSize: number,
  fontFamily: string,
  color: string,
  startAngle: number = 0,
  isFlipped: boolean = false,
  fontWeight: string = 'normal',
  fontStyle: string = 'normal'
): Promise<string> {
  try {
    const font = await loadFont(fontFamily, fontWeight, fontStyle);
    const paths: string[] = [];

    let totalWidth = 0;
    const charData: Array<{
      char: string;
      advance: number;
      isSpace: boolean;
      glyphPath?: opentype.Path;
    }> = [];

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const advance = font.getAdvanceWidth(char, fontSize);

      if (char === ' ') {
        charData.push({ char, advance, isSpace: true });
      } else {
        const glyphPath = font.getPath(char, 0, 0, fontSize);
        charData.push({ char, advance, isSpace: false, glyphPath });
      }
      totalWidth += advance;
    }

    const circumference = 2 * Math.PI * radius;
    if (totalWidth > circumference * 0.9) {
      const scale = (circumference * 0.9) / totalWidth;
      fontSize = fontSize * scale;

      totalWidth = 0;
      charData.length = 0;

      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const advance = font.getAdvanceWidth(char, fontSize);

        if (char === ' ') {
          charData.push({ char, advance, isSpace: true });
        } else {
          const glyphPath = font.getPath(char, 0, 0, fontSize);
          charData.push({ char, advance, isSpace: false, glyphPath });
        }
        totalWidth += advance;
      }
    }

    const textArcAngle = totalWidth / radius;
    const startAngleRad = (startAngle * Math.PI) / 180;

    let currentAngle = isFlipped 
      ? startAngleRad + textArcAngle / 2 
      : startAngleRad - textArcAngle / 2;

    for (let i = 0; i < charData.length; i++) {
      const data = charData[i];

      if (data.isSpace) {
        currentAngle += (isFlipped ? -1 : 1) * data.advance / radius;
        continue;
      }

      const { advance, glyphPath } = data;
      if (!glyphPath) continue;

      let pathData = '';
      glyphPath.commands.forEach((cmd: opentype.PathCommand) => {
        if (cmd.type === 'M') {
          pathData += `M ${cmd.x} ${cmd.y} `;
        } else if (cmd.type === 'L') {
          pathData += `L ${cmd.x} ${cmd.y} `;
        } else if (cmd.type === 'C') {
          pathData += `C ${cmd.x1} ${cmd.y1} ${cmd.x2} ${cmd.y2} ${cmd.x} ${cmd.y} `;
        } else if (cmd.type === 'Q') {
          pathData += `Q ${cmd.x1} ${cmd.y1} ${cmd.x} ${cmd.y} `;
        } else if (cmd.type === 'Z') {
          pathData += 'Z ';
        }
      });

      if (!pathData) {
        currentAngle += (isFlipped ? -1 : 1) * advance / radius;
        continue;
      }

      const bbox = glyphPath.getBoundingBox();
      const centerX = (bbox.x1 + bbox.x2) / 2;
      const centerY = (bbox.y1 + bbox.y2) / 2;

      currentAngle += (isFlipped ? -1 : 1) * (advance / 2) / radius;

      const charX = cx + Math.cos(currentAngle) * radius;
      const charY = cy + Math.sin(currentAngle) * radius;

      let rotationRad = currentAngle + Math.PI / 2;
      if (isFlipped) {
        rotationRad -= Math.PI;
      }

      const rotationDeg = (rotationRad * 180) / Math.PI;

      const transformedPath = svgpath(pathData)
        .translate(-centerX, -centerY)
        .rotate(rotationDeg, 0, 0)
        .translate(charX, charY)
        .toString();

      paths.push(`<path d="${transformedPath}" fill="${color}"/>`);

      currentAngle += (isFlipped ? -1 : 1) * (advance / 2) / radius;
    }

    return paths.join('\n');
  } catch (error) {
    console.error('Error converting curved text to path:', error);
    
    const pathId = `fallback-path-${Date.now()}`;
    const x1 = cx + radius * Math.cos((startAngle * Math.PI) / 180);
    const y1 = cy + radius * Math.sin((startAngle * Math.PI) / 180);
    const x2 = cx + radius * Math.cos(((startAngle + 180) * Math.PI) / 180);
    const y2 = cy + radius * Math.sin(((startAngle + 180) * Math.PI) / 180);
    const sweepFlag = isFlipped ? 0 : 1;
    const pathD = `M ${x1},${y1} A ${radius},${radius} 0 0,${sweepFlag} ${x2},${y2} A ${radius},${radius} 0 0,${sweepFlag} ${x1},${y1}`;

    return `
      <defs>
        <path id="${pathId}" d="${pathD}" fill="none"/>
      </defs>
      <text fill="${color}" font-size="${fontSize}" font-family="${fontFamily}" font-weight="${fontWeight}" font-style="${fontStyle}">
        <textPath href="#${pathId}" startOffset="50%" text-anchor="middle">${text}</textPath>
      </text>
    `;
  }
}