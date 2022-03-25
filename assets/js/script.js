
var palette =[
    {
        'rgb': [133, 42, 244],
        'locked': false
    },
    {
        'rgb': [33, 22, 44],
        'locked': false
    },
    {
        'rgb': [13, 52, 24],
        'locked': false
    },
    {
        'rgb': [20, 60, 48],
        'locked': false
    },
    {
        'rgb': [226,209,167],
        'locked': false
    }
];

var color= {
    'rgb': [133, 42, 244],
    'locked': false
};

console.log(color.lock);

var url = "http://colormind.io/api/";
var data = {
	model : "default",
	input : [[44,43,44],[90,83,82],"N","N","N"]
};

var http = new XMLHttpRequest();

http.onreadystatechange = function() {
	if(http.readyState == 4 && http.status == 200) {
		var palette = JSON.parse(http.responseText).result;
    console.log(palette);
	}
};

http.open("POST", url, true);
http.send(JSON.stringify(data));

// Sets locked to true
// Any function that updates colors will need to check if locked before updating the color
$(".colorBlock").on("click", function() {
    //search for position id
    var position = this.getAttribute("data-color-id") - 1;
    console.log(position);

    palette[position].locked = true;
    console.log(palette[position]);
});

// Displays colors ordered from darkest to lightest in color blocks
const showNewColors = function(rgbColors) {
    // Create an array of HSV colors sorted darkest to lightest
    let hsvColors = sortColors(rgbColors);

    // Update each color block with a background color from our sorted array
    for (let i=0; i < hsvColors.length; i++) {
        let colorBlockEl = document.querySelector(`[data-color-id="${i+1}"]`)
        colorBlockEl.style.backgroundColor = `hsl(${hsvColors[i][0]}, ${hsvColors[i][1]}%, ${hsvColors[i][2]}%)`;
    }

    return true;
}

// Takes unsorted RGB colors from Colormind and sorts them from darkest to lightest into a new array
const sortColors = function(rgbColors) {
    let hsvColors = [];
    let sortedHsvColors = [];

    // Iterate through each RGB color, convert to HSL, populate HSV color list
    for (let index in rgbColors) {
        // Current RGB color being converted to HSL
        let colorValues = rgbColors[index]
        // Converted HSL color values
        let hsvColor = rgbToHsl(colorValues[0], colorValues[1], colorValues[2]);
        // Update HSV array with converted color values
        hsvColors.push(hsvColor);
    }

    // Sort the HSL values by their L (lightness)
    for (let index in hsvColors) {
        // If sorted array is empty, add first color
        if (sortedHsvColors[0] === undefined) {
            sortedHsvColors.push(hsvColors[index]);
            hsvColors.shift();
        }

        let highestIndex = 0;
        // Selects index at which unsorted color should be inserted into array (ordered darkest to lightest)
        for (let i=0; i < sortedHsvColors.length; i++) {
            // if value (lightness) of unsorted color is higher than sorted color, update the highestIndex
            if (hsvColors[index][2] > sortedHsvColors[i][2]) {
                highestIndex = i+1;
            }
        }
        // Insert unsorted color into sorted array at selected index
        sortedHsvColors.splice(highestIndex, 0, hsvColors[index]);
    }

    console.log(sortedHsvColors)
    return sortedHsvColors;
}

const requestColorPalette = function() {
    
    var url = "http://colormind.io/api/";
    var data = {
        model : "default",
    }

    var http = new XMLHttpRequest();

    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
            var rgbColors = JSON.parse(http.responseText).result;
            return showNewColors(rgbColors);
        }
    }

    http.open("POST", url, true);
    http.send(JSON.stringify(data));
}

// Function from https://www.30secondsofcode.org/js/s/rgb-to-hsl
// Converts RBG values to HSL color values
// Expects integers as arguments, returns an array of integers
const rgbToHsl = function(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const l = Math.max(r, g, b);
    const s = l - Math.min(r, g, b);
    const h = s
      ? l === r
        ? (g - b) / s
        : l === g
        ? 2 + (b - r) / s
        : 4 + (r - g) / s
      : 0;
    return [
      60 * h < 0 ? 60 * h + 360 : 60 * h,
      100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
      (100 * (2 * l - s)) / 2,
    ];
  };

requestColorPalette();
