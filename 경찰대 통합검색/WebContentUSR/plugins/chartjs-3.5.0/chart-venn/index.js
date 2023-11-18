/**
 * chartjs-chart-venn
 * https://github.com/upsetjs/chartjs-chart-venn
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import { Element, BarElement, registry, DatasetController, Chart, LinearScale } from 'chart.js';
import { layout as layout$1 } from '@upsetjs/venn.js';

function isEllipse(d) {
    return typeof d.rx === 'number';
}

function generateArcSlicePath(s, refs, p = 0) {
    if (s.path) {
        return s.path;
    }
    return `M ${s.x1 - p},${s.y1 - p} ${s.arcs
        .map((arc) => {
        const ref = refs[arc.ref];
        const rx = isEllipse(ref) ? ref.rx : ref.r;
        const ry = isEllipse(ref) ? ref.ry : ref.r;
        const rot = isEllipse(ref) ? ref.rotation : 0;
        return `A ${rx - p} ${ry - p} ${rot} ${arc.large ? 1 : 0} ${arc.sweep ? 1 : 0} ${arc.x2 - p} ${arc.y2 - p}`;
    })
        .join(' ')}`;
}

function len(x, y) {
    return Math.sqrt(x * x + y * y);
}
function dist(a, b) {
    return len(a.cx - b.cx, a.cy - b.cy);
}
const DEG2RAD = (1 / 180) * Math.PI;
function pointAtCircle(cx, cy, radius, angle) {
    return {
        x: cx + Math.cos(angle * DEG2RAD) * radius,
        y: cy + Math.sin(angle * DEG2RAD) * radius,
    };
}

class ArcSlice extends Element {
    inRange(mouseX, mouseY) {
        var _a;
        const props = this.getProps(['arcs', 'refs', 'sets']);
        const usedSets = new Set(props.sets);
        function checkRef(p, ref, inside) {
            if (isEllipse(ref)) {
                const a = ref.rotation * DEG2RAD;
                const x = p.cx - ref.cx;
                const y = p.cy - ref.cy;
                const d = (x * Math.cos(a) + y * Math.sin(a)) ** 2 / ref.rx ** 2 +
                    (x * Math.sin(a) - y * Math.cos(a)) ** 2 / ref.ry ** 2;
                if ((inside && d > 1) || (!inside && d < 1)) {
                    return false;
                }
            }
            else {
                const d = dist(p, ref);
                if ((inside && d > ref.r) || (!inside && d < ref.r)) {
                    return false;
                }
            }
            return true;
        }
        for (const arc of (_a = props.arcs) !== null && _a !== void 0 ? _a : []) {
            const ref = props.refs[arc.ref];
            const p = {
                cx: Number.isNaN(mouseX) ? ref.cx : mouseX,
                cy: Number.isNaN(mouseY) ? ref.cy : mouseY,
            };
            usedSets.delete(arc.ref);
            if (!checkRef(p, ref, arc.mode === 'i')) {
                return false;
            }
        }
        const remaining = Array.from(usedSets);
        for (let i = 0; i < remaining.length; i += 1) {
            const ref = props.refs[remaining[i]];
            const p = {
                cx: Number.isNaN(mouseX) ? ref.cx : mouseX,
                cy: Number.isNaN(mouseY) ? ref.cy : mouseY,
            };
            if (!checkRef(p, ref, true)) {
                return false;
            }
        }
        return true;
    }
    inXRange(mouseX) {
        return this.inRange(mouseX, Number.NaN);
    }
    inYRange(mouseY) {
        return this.inRange(Number.NaN, mouseY);
    }
    getCenterPoint() {
        const arc = this.getProps(['text']);
        return arc.text;
    }
    tooltipPosition() {
        return this.getCenterPoint();
    }
    hasValue() {
        return true;
    }
    draw(ctx) {
        ctx.save();
        const options = this.options;
        const props = this.getProps(['x1', 'y1', 'arcs', 'refs']);
        ctx.beginPath();
        let path;
        if (window.Path2D && typeof jest === 'undefined') {
            path = new Path2D(generateArcSlicePath(props, props.refs));
        }
        else {
            ctx.beginPath();
            ctx.moveTo(props.x1, props.y1);
            for (const arc of props.arcs) {
                const ref = props.refs[arc.ref];
                const rx = isEllipse(ref) ? ref.rx : ref.r;
                const ry = isEllipse(ref) ? ref.ry : ref.r;
                const rot = isEllipse(ref) ? ref.rotation : 0;
                ctx.ellipse(ref.cx, ref.cy, rx, ry, rot, 0, Math.PI * 2, !arc.sweep);
            }
        }
        if (options.backgroundColor) {
            ctx.fillStyle = options.backgroundColor;
            if (path) {
                ctx.fill(path);
            }
            else {
                ctx.fill();
            }
        }
        if (options.borderColor) {
            ctx.strokeStyle = options.borderColor;
            ctx.lineWidth = options.borderWidth;
            if (path) {
                ctx.stroke(path);
            }
            else {
                ctx.stroke();
            }
        }
        ctx.restore();
    }
}
ArcSlice.id = 'arcSlice';
ArcSlice.defaults = { ...BarElement.defaults, backgroundColor: '#efefef' };
ArcSlice.defaultRoutes = {
    borderColor: 'borderColor',
};

var sets$5 = [
];
var intersections$5 = [
];
var bb$5 = {
	x: 0,
	y: 0,
	width: 10,
	height: 10
};
var venn0 = {
	sets: sets$5,
	intersections: intersections$5,
	bb: bb$5
};

var sets$4 = [
	{
		cx: 0,
		cy: 0,
		r: 5,
		text: {
			x: 3.5,
			y: -4
		},
		align: "start",
		verticalAlign: "bottom"
	}
];
var intersections$4 = [
	{
		sets: [
			0
		],
		x1: 0,
		y1: 5,
		arcs: [
			{
				mode: "i",
				ref: 0,
				x2: 0,
				y2: -5,
				sweep: false,
				large: false
			},
			{
				mode: "i",
				ref: 0,
				x2: 0,
				y2: 5,
				sweep: false,
				large: false
			}
		],
		text: {
			x: 0,
			y: 0
		}
	}
];
var bb$4 = {
	x: -5,
	y: -5,
	width: 10,
	height: 10
};
var venn1 = {
	sets: sets$4,
	intersections: intersections$4,
	bb: bb$4
};

var sets$3 = [
	{
		cx: -4,
		cy: 0,
		r: 5,
		text: {
			x: -7.5,
			y: 4
		},
		align: "end",
		verticalAlign: "top"
	},
	{
		cx: 4,
		cy: 0,
		r: 5,
		text: {
			x: 7.5,
			y: -4
		},
		align: "start",
		verticalAlign: "bottom"
	}
];
var intersections$3 = [
	{
		sets: [
			0
		],
		x1: 0,
		y1: -3,
		arcs: [
			{
				mode: "i",
				ref: 0,
				x2: 0,
				y2: 3,
				sweep: false,
				large: true
			},
			{
				mode: "o",
				ref: 1,
				x2: 0,
				y2: -3,
				sweep: true,
				large: false
			}
		],
		text: {
			x: -4,
			y: 0
		}
	},
	{
		sets: [
			1
		],
		x1: 0,
		y1: 3,
		arcs: [
			{
				mode: "i",
				ref: 1,
				x2: 0,
				y2: -3,
				sweep: false,
				large: true
			},
			{
				mode: "o",
				ref: 0,
				x2: 0,
				y2: 3,
				sweep: true,
				large: false
			}
		],
		text: {
			x: 4,
			y: 0
		}
	},
	{
		sets: [
			0,
			1
		],
		x1: 0,
		y1: 3,
		arcs: [
			{
				mode: "i",
				ref: 0,
				x2: 0,
				y2: -3,
				sweep: false,
				large: false
			},
			{
				mode: "i",
				ref: 1,
				x2: 0,
				y2: 3,
				sweep: false,
				large: false
			}
		],
		text: {
			x: 0,
			y: 0
		}
	}
];
var bb$3 = {
	x: -9,
	y: -5,
	width: 18,
	height: 10
};
var venn2 = {
	sets: sets$3,
	intersections: intersections$3,
	bb: bb$3
};

var sets$2 = [
	{
		cx: -3.464,
		cy: -2,
		r: 5,
		text: {
			x: -7,
			y: -6
		},
		align: "end"
	},
	{
		cx: 3.464,
		cy: -2,
		r: 5,
		text: {
			x: 7,
			y: -6
		},
		align: "start"
	},
	{
		cx: 0,
		cy: 4,
		r: 5,
		text: {
			x: 4,
			y: 7.5
		},
		align: "start",
		verticalAlign: "top"
	}
];
var intersections$2 = [
	{
		sets: [
			0
		],
		x1: -4.855,
		y1: 2.803,
		arcs: [
			{
				mode: "o",
				ref: 2,
				x2: -1.39,
				y2: -0.803,
				sweep: true,
				large: false
			},
			{
				mode: "o",
				ref: 1,
				x2: 0,
				y2: -5.606,
				sweep: true,
				large: false
			},
			{
				mode: "i",
				ref: 0,
				x2: -4.855,
				y2: 2.803,
				sweep: false,
				large: true
			}
		],
		text: {
			x: -4.216,
			y: -2.434
		}
	},
	{
		sets: [
			1
		],
		x1: 0,
		y1: -5.606,
		arcs: [
			{
				mode: "o",
				ref: 0,
				x2: 1.39,
				y2: -0.803,
				sweep: true,
				large: false
			},
			{
				mode: "o",
				ref: 2,
				x2: 4.855,
				y2: 2.803,
				sweep: true,
				large: false
			},
			{
				mode: "i",
				ref: 1,
				x2: 0,
				y2: -5.606,
				sweep: false,
				large: true
			}
		],
		text: {
			x: 4.216,
			y: -2.434
		}
	},
	{
		sets: [
			2
		],
		x1: -4.855,
		y1: 2.803,
		arcs: [
			{
				mode: "o",
				ref: 0,
				x2: 0,
				y2: 1.606,
				sweep: false,
				large: false
			},
			{
				mode: "o",
				ref: 1,
				x2: 4.855,
				y2: 2.803,
				sweep: false,
				large: false
			},
			{
				mode: "i",
				ref: 2,
				x2: -4.855,
				y2: 2.803,
				sweep: true,
				large: true
			}
		],
		text: {
			x: 0,
			y: 4.869
		}
	},
	{
		sets: [
			0,
			1
		],
		x1: 0,
		y1: -5.606,
		arcs: [
			{
				mode: "i",
				ref: 1,
				x2: -1.39,
				y2: -0.803,
				sweep: false,
				large: false
			},
			{
				mode: "o",
				ref: 2,
				x2: 1.39,
				y2: -0.803,
				sweep: true,
				large: false
			},
			{
				mode: "i",
				ref: 0,
				x2: 0,
				y2: -5.606,
				sweep: false,
				large: false
			}
		],
		text: {
			x: 0,
			y: -2.404
		}
	},
	{
		sets: [
			0,
			2
		],
		x1: -4.855,
		y1: 2.803,
		arcs: [
			{
				mode: "i",
				ref: 2,
				x2: -1.39,
				y2: -0.803,
				sweep: true,
				large: false
			},
			{
				mode: "o",
				ref: 1,
				x2: 0,
				y2: 1.606,
				sweep: false,
				large: false
			},
			{
				mode: "i",
				ref: 0,
				x2: -4.855,
				y2: 2.803,
				sweep: true,
				large: false
			}
		],
		text: {
			x: -2.082,
			y: 1.202
		}
	},
	{
		sets: [
			1,
			2
		],
		x1: 4.855,
		y1: 2.803,
		arcs: [
			{
				mode: "i",
				ref: 2,
				x2: 1.39,
				y2: -0.803,
				sweep: false,
				large: false
			},
			{
				mode: "o",
				ref: 0,
				x2: 0,
				y2: 1.606,
				sweep: true,
				large: false
			},
			{
				mode: "i",
				ref: 1,
				x2: 4.855,
				y2: 2.803,
				sweep: false,
				large: false
			}
		],
		text: {
			x: 2.082,
			y: 1.202
		}
	},
	{
		sets: [
			0,
			1,
			2
		],
		x1: 1.39,
		y1: -0.803,
		arcs: [
			{
				mode: "i",
				ref: 0,
				x2: 0,
				y2: 1.606,
				sweep: true,
				large: false
			},
			{
				mode: "i",
				ref: 1,
				x2: -1.39,
				y2: -0.803,
				sweep: true,
				large: false
			},
			{
				mode: "i",
				ref: 2,
				x2: 1.39,
				y2: -0.803,
				sweep: true,
				large: false
			}
		],
		text: {
			x: 0,
			y: 0
		}
	}
];
var bb$2 = {
	x: -8.464,
	y: -7,
	width: 16.928,
	height: 16
};
var venn3 = {
	sets: sets$2,
	intersections: intersections$2,
	bb: bb$2
};

var sets$1 = [
	{
		cx: 0.439,
		cy: -1.061,
		rx: 2.5,
		ry: 5,
		rotation: 45,
		text: {
			x: 4.5,
			y: -4.5
		},
		align: "start",
		verticalAlign: "bottom"
	},
	{
		cx: 2.561,
		cy: 1.061,
		rx: 2.5,
		ry: 5,
		rotation: 45,
		text: {
			x: 4,
			y: 3.75
		},
		align: "start",
		verticalAlign: "top"
	},
	{
		cx: -2.561,
		cy: 1.061,
		rx: 2.5,
		ry: 5,
		rotation: -45,
		text: {
			x: -4,
			y: 3.7
		},
		align: "end",
		verticalAlign: "top"
	},
	{
		cx: -0.439,
		cy: -1.061,
		rx: 2.5,
		ry: 5,
		rotation: -45,
		text: {
			x: -4.5,
			y: -4.5
		},
		align: "end",
		verticalAlign: "bottom"
	}
];
var intersections$1 = [
	{
		sets: [
			0
		],
		x1: 0,
		y1: -3.94,
		arcs: [
			{
				ref: 0,
				mode: "i",
				x2: 4.328,
				y2: -2.828,
				sweep: true,
				large: false
			},
			{
				ref: 1,
				mode: "o",
				x2: 2.179,
				y2: -1.858,
				large: false
			},
			{
				ref: 3,
				mode: "o",
				x2: 0,
				y2: -3.94,
				large: false
			}
		],
		text: {
			x: 2.914,
			y: -3.536
		}
	},
	{
		sets: [
			1
		],
		x1: 4.328,
		y1: -2.828,
		arcs: [
			{
				ref: 1,
				mode: "i",
				x2: 0,
				y2: 5.006,
				sweep: true,
				large: true
			},
			{
				ref: 2,
				mode: "o",
				x2: 1.328,
				y2: 2.828
			},
			{
				ref: 3,
				mode: "o",
				x2: 3.108,
				y2: -0.328
			},
			{
				ref: 0,
				mode: "o",
				x2: 4.328,
				y2: -2.828
			}
		],
		text: {
			x: 5.036,
			y: -1.414
		}
	},
	{
		sets: [
			2
		],
		x1: 0,
		y1: 5.006,
		arcs: [
			{
				ref: 2,
				mode: "i",
				x2: -4.328,
				y2: -2.828,
				sweep: true,
				large: true
			},
			{
				ref: 3,
				mode: "o",
				x2: -3.108,
				y2: -0.328
			},
			{
				ref: 0,
				mode: "o",
				x2: -1.328,
				y2: 2.828
			},
			{
				ref: 1,
				mode: "o",
				x2: 0,
				y2: 5.006
			}
		],
		text: {
			x: -5.036,
			y: -1.414
		}
	},
	{
		sets: [
			3
		],
		x1: -4.328,
		y1: -2.828,
		arcs: [
			{
				ref: 3,
				mode: "i",
				x2: 0,
				y2: -3.94,
				sweep: true,
				large: false
			},
			{
				ref: 0,
				mode: "o",
				x2: -2.179,
				y2: -1.858,
				large: false
			},
			{
				ref: 2,
				mode: "o",
				x2: -4.328,
				y2: -2.828,
				large: false
			}
		],
		text: {
			x: -2.914,
			y: -3.536
		}
	},
	{
		sets: [
			0,
			1
		],
		x1: 4.328,
		y1: -2.828,
		arcs: [
			{
				ref: 1,
				mode: "i",
				x2: 3.108,
				y2: -0.328,
				sweep: true,
				large: false
			},
			{
				ref: 3,
				mode: "o",
				x2: 2.179,
				y2: -1.858,
				sweep: false,
				large: false
			},
			{
				ref: 0,
				mode: "i",
				x2: 4.328,
				y2: -2.828,
				sweep: true,
				large: false
			}
		],
		text: {
			x: 3.205,
			y: -1.672
		}
	},
	{
		sets: [
			0,
			2
		],
		x1: -1.328,
		y1: 2.828,
		arcs: [
			{
				ref: 0,
				mode: "i",
				x2: -3.108,
				y2: -0.328,
				sweep: true,
				large: false
			},
			{
				ref: 3,
				mode: "o",
				x2: -0.969,
				y2: 1.755,
				large: false
			},
			{
				ref: 1,
				mode: "o",
				x2: -1.328,
				y2: 2.828,
				large: false
			}
		],
		text: {
			x: -2.212,
			y: 1.591
		}
	},
	{
		sets: [
			0,
			3
		],
		x1: 0,
		y1: -3.94,
		arcs: [
			{
				ref: 3,
				mode: "i",
				x2: 2.179,
				y2: -1.858,
				sweep: true,
				large: false
			},
			{
				ref: 1,
				mode: "o",
				x2: 0,
				y2: 0.188,
				sweep: false,
				large: false
			},
			{
				ref: 2,
				mode: "o",
				x2: -2.179,
				y2: -1.858,
				sweep: false,
				large: false
			},
			{
				ref: 0,
				mode: "i",
				x2: 0,
				y2: -3.94,
				sweep: true
			}
		],
		text: {
			x: 0,
			y: -1.87
		}
	},
	{
		sets: [
			1,
			2
		],
		x1: 1.328,
		y1: 2.828,
		arcs: [
			{
				ref: 2,
				mode: "i",
				x2: 0,
				y2: 5.006,
				sweep: true,
				large: false
			},
			{
				ref: 1,
				mode: "i",
				x2: -1.328,
				y2: 2.828,
				sweep: true,
				large: false
			},
			{
				ref: 0,
				mode: "o",
				x2: 0,
				y2: 2.346,
				large: false
			},
			{
				ref: 3,
				mode: "o",
				x2: 1.328,
				y2: 2.828
			}
		],
		text: {
			x: 0,
			y: 3.393
		}
	},
	{
		sets: [
			1,
			3
		],
		x1: 3.108,
		y1: -0.328,
		arcs: [
			{
				ref: 3,
				mode: "i",
				x2: 1.328,
				y2: 2.828,
				sweep: true,
				large: false
			},
			{
				ref: 2,
				mode: "o",
				x2: 0.969,
				y2: 1.755,
				large: false
			},
			{
				ref: 1,
				mode: "i",
				x2: 3.108,
				y2: -0.328,
				large: false
			}
		],
		text: {
			x: 2.212,
			y: 1.591
		}
	},
	{
		sets: [
			2,
			3
		],
		x1: -3.108,
		y1: -0.328,
		arcs: [
			{
				ref: 3,
				mode: "i",
				x2: -4.328,
				y2: -2.828,
				sweep: true,
				large: false
			},
			{
				ref: 2,
				mode: "i",
				x2: -2.179,
				y2: -1.858,
				sweep: true,
				large: false
			},
			{
				ref: 0,
				mode: "o",
				x2: -3.108,
				y2: -0.328,
				large: false
			}
		],
		text: {
			x: -3.205,
			y: -1.672
		}
	},
	{
		sets: [
			0,
			1,
			2
		],
		x1: 0,
		y1: 2.346,
		arcs: [
			{
				ref: 0,
				mode: "i",
				x2: -1.328,
				y2: 2.828,
				sweep: true,
				large: false
			},
			{
				ref: 1,
				mode: "i",
				x2: -0.969,
				y2: 1.755,
				sweep: true,
				large: false
			},
			{
				ref: 3,
				mode: "o",
				x2: 0,
				y2: 2.346,
				large: false
			}
		],
		text: {
			x: -0.766,
			y: 2.31
		}
	},
	{
		sets: [
			0,
			1,
			3
		],
		x1: 2.179,
		y1: -1.858,
		arcs: [
			{
				ref: 3,
				mode: "i",
				x2: 3.108,
				y2: -0.328,
				sweep: true,
				large: false
			},
			{
				ref: 0,
				mode: "i",
				x2: 0.969,
				y2: 1.755,
				sweep: true,
				large: false
			},
			{
				ref: 2,
				mode: "o",
				x2: 0,
				y2: 0.188,
				sweep: false,
				large: false
			},
			{
				ref: 1,
				mode: "i",
				x2: 2.179,
				y2: -1.858,
				sweep: true
			}
		],
		text: {
			x: 1.558,
			y: -0.056
		}
	},
	{
		sets: [
			0,
			2,
			3
		],
		x1: -0.969,
		y1: 1.755,
		arcs: [
			{
				ref: 3,
				mode: "i",
				x2: -3.108,
				y2: -0.328,
				sweep: true,
				large: false
			},
			{
				ref: 0,
				mode: "i",
				x2: -2.179,
				y2: -1.858,
				sweep: true,
				large: false
			},
			{
				ref: 2,
				mode: "i",
				x2: 0,
				y2: 0.188,
				sweep: true,
				large: false
			},
			{
				ref: 1,
				mode: "o",
				x2: -0.969,
				y2: 1.755
			}
		],
		text: {
			x: -1.558,
			y: -0.056
		}
	},
	{
		sets: [
			1,
			2,
			3
		],
		x1: 1.328,
		y1: 2.828,
		arcs: [
			{
				ref: 3,
				mode: "i",
				x2: 0,
				y2: 2.346,
				sweep: true,
				large: false
			},
			{
				ref: 0,
				mode: "o",
				x2: 0.969,
				y2: 1.755,
				sweep: false,
				large: false
			},
			{
				ref: 2,
				mode: "i",
				x2: 1.328,
				y2: 2.828,
				sweep: true,
				large: false
			}
		],
		text: {
			x: 0.766,
			y: 2.31
		}
	},
	{
		sets: [
			0,
			1,
			2,
			3
		],
		x1: 0,
		y1: 0.188,
		arcs: [
			{
				ref: 2,
				mode: "i",
				x2: 0.969,
				y2: 1.755,
				sweep: true,
				large: false
			},
			{
				ref: 0,
				mode: "i",
				x2: 0,
				y2: 2.346,
				sweep: true,
				large: false
			},
			{
				ref: 3,
				mode: "i",
				x2: -0.969,
				y2: 1.755,
				sweep: true,
				large: false
			},
			{
				ref: 1,
				mode: "i",
				x2: 0,
				y2: 0.188,
				sweep: true
			}
		],
		text: {
			x: 0,
			y: 1.43
		}
	}
];
var bb$1 = {
	x: -6.5,
	y: -5,
	width: 13,
	height: 10
};
var venn4 = {
	sets: sets$1,
	intersections: intersections$1,
	bb: bb$1
};

var sets = [
	{
		cx: 0.5,
		cy: -1,
		rx: 2.5,
		ry: 5,
		rotation: 0,
		text: {
			x: 2.25,
			y: -5
		},
		align: "start",
		verticalAlign: "bottom"
	},
	{
		cx: 1.106,
		cy: 0.167,
		rx: 2.5,
		ry: 5,
		rotation: 72,
		text: {
			x: 4.5,
			y: 1.5
		},
		align: "start",
		verticalAlign: "top"
	},
	{
		cx: 0.183,
		cy: 1.103,
		rx: 2.5,
		ry: 5,
		rotation: 144,
		text: {
			x: 4,
			y: 4
		},
		align: "start",
		verticalAlign: "bottom"
	},
	{
		cx: -0.992,
		cy: 0.515,
		rx: 2.5,
		ry: 5,
		rotation: 216,
		text: {
			x: -4.7,
			y: 2
		},
		align: "end",
		verticalAlign: "bottom"
	},
	{
		cx: -0.797,
		cy: -0.785,
		rx: 2.5,
		ry: 5,
		rotation: 288,
		text: {
			x: -4,
			y: -3.6
		},
		align: "end",
		verticalAlign: "bottom"
	}
];
var intersections = [
	{
		sets: [
			0
		],
		x1: -1.653,
		y1: -3.541,
		arcs: [
			{
				ref: 0,
				mode: "i",
				x2: 2.857,
				y2: -2.666,
				sweep: true,
				large: false
			},
			{
				ref: 1,
				mode: "o",
				x2: 2.5,
				y2: -2.648,
				large: false
			},
			{
				ref: 3,
				mode: "o",
				x2: -0.495,
				y2: -3.303,
				large: false
			},
			{
				ref: 4,
				mode: "o",
				x2: -1.653,
				y2: -3.541
			}
		],
		text: {
			x: 0.5,
			y: -5
		}
	},
	{
		sets: [
			1
		],
		x1: 2.857,
		y1: -2.666,
		arcs: [
			{
				ref: 1,
				mode: "i",
				x2: 3.419,
				y2: 1.893,
				sweep: true,
				large: false
			},
			{
				ref: 2,
				mode: "o",
				x2: 3.291,
				y2: 1.559,
				large: false
			},
			{
				ref: 4,
				mode: "o",
				x2: 2.988,
				y2: -1.492,
				large: false
			},
			{
				ref: 0,
				mode: "o",
				x2: 2.857,
				y2: -2.666
			}
		],
		text: {
			x: 4.91,
			y: -1.07
		}
	},
	{
		sets: [
			2
		],
		x1: 3.419,
		y1: 1.893,
		arcs: [
			{
				ref: 2,
				mode: "i",
				x2: -0.744,
				y2: 3.837,
				sweep: true,
				large: false
			},
			{
				ref: 3,
				mode: "o",
				x2: -0.466,
				y2: 3.612,
				large: false
			},
			{
				ref: 0,
				mode: "o",
				x2: 2.342,
				y2: 2.381,
				large: false
			},
			{
				ref: 1,
				mode: "o",
				x2: 3.419,
				y2: 1.893
			}
		],
		text: {
			x: 2.534,
			y: 4.339
		}
	},
	{
		sets: [
			3
		],
		x1: -0.744,
		y1: 3.837,
		arcs: [
			{
				ref: 3,
				mode: "i",
				x2: -3.879,
				y2: 0.478,
				sweep: true,
				large: false
			},
			{
				ref: 4,
				mode: "o",
				x2: -3.579,
				y2: 0.673,
				large: false
			},
			{
				ref: 1,
				mode: "o",
				x2: -1.54,
				y2: 2.963,
				large: false
			},
			{
				ref: 2,
				mode: "o",
				x2: -0.744,
				y2: 3.837
			}
		],
		text: {
			x: -3.343,
			y: 3.751
		}
	},
	{
		sets: [
			4
		],
		x1: -3.879,
		y1: 0.478,
		arcs: [
			{
				ref: 4,
				mode: "i",
				x2: -1.653,
				y2: -3.541,
				sweep: true,
				large: false
			},
			{
				ref: 0,
				mode: "o",
				x2: -1.746,
				y2: -3.196,
				large: false
			},
			{
				ref: 2,
				mode: "o",
				x2: -3.294,
				y2: -0.549,
				large: false
			},
			{
				ref: 3,
				mode: "o",
				x2: -3.879,
				y2: 0.478
			}
		],
		text: {
			x: -4.601,
			y: -2.021
		}
	},
	{
		sets: [
			0,
			1
		],
		x1: 2.5,
		y1: -2.648,
		arcs: [
			{
				ref: 1,
				mode: "i",
				x2: 2.857,
				y2: -2.666,
				sweep: true,
				large: false
			},
			{
				ref: 0,
				mode: "i",
				x2: 2.988,
				y2: -1.492,
				sweep: true,
				large: false
			},
			{
				ref: 4,
				mode: "o",
				x2: 2.572,
				y2: -1.839,
				large: false
			},
			{
				ref: 3,
				mode: "o",
				x2: 2.5,
				y2: -2.648
			}
		],
		text: {
			x: 2.741,
			y: -2.152
		}
	},
	{
		sets: [
			0,
			2
		],
		x1: 2.342,
		y1: 2.381,
		arcs: [
			{
				ref: 0,
				mode: "i",
				x2: -0.466,
				y2: 3.612,
				sweep: true,
				large: false
			},
			{
				ref: 3,
				mode: "o",
				x2: 0.257,
				y2: 2.922,
				large: false
			},
			{
				ref: 1,
				mode: "o",
				x2: 2.342,
				y2: 2.381,
				large: false
			}
		],
		text: {
			x: 0.5,
			y: 3.5
		}
	},
	{
		sets: [
			0,
			3
		],
		x1: -0.495,
		y1: -3.303,
		arcs: [
			{
				ref: 3,
				mode: "i",
				x2: 2.5,
				y2: -2.648,
				sweep: true,
				large: false
			},
			{
				ref: 1,
				mode: "o",
				x2: 1.51,
				y2: -2.515,
				large: false
			},
			{
				ref: 4,
				mode: "o",
				x2: -0.495,
				y2: -3.303,
				large: false
			}
		],
		text: {
			x: 1.653,
			y: -3.125
		}
	},
	{
		sets: [
			0,
			4
		],
		x1: -1.653,
		y1: -3.541,
		arcs: [
			{
				ref: 4,
				mode: "i",
				x2: -0.495,
				y2: -3.303,
				sweep: true,
				large: false
			},
			{
				ref: 3,
				mode: "o",
				x2: -0.954,
				y2: -3.015,
				large: false
			},
			{
				ref: 2,
				mode: "o",
				x2: -1.746,
				y2: -3.196,
				large: false
			},
			{
				ref: 0,
				mode: "i",
				x2: -1.653,
				y2: -3.541
			}
		],
		text: {
			x: -1.199,
			y: -3.272
		}
	},
	{
		sets: [
			1,
			2
		],
		x1: 3.291,
		y1: 1.559,
		arcs: [
			{
				ref: 2,
				mode: "i",
				x2: 3.419,
				y2: 1.893,
				sweep: true,
				large: false
			},
			{
				ref: 1,
				mode: "i",
				x2: 2.342,
				y2: 2.381,
				sweep: true,
				large: false
			},
			{
				ref: 0,
				mode: "o",
				x2: 2.544,
				y2: 1.878,
				large: false
			},
			{
				ref: 4,
				mode: "o",
				x2: 3.291,
				y2: 1.559
			}
		],
		text: {
			x: 2.894,
			y: 1.942
		}
	},
	{
		sets: [
			1,
			3
		],
		x1: -1.54,
		y1: 2.963,
		arcs: [
			{
				ref: 1,
				mode: "i",
				x2: -3.579,
				y2: 0.673,
				sweep: true,
				large: false
			},
			{
				ref: 4,
				mode: "o",
				x2: -2.7,
				y2: 1.147,
				large: false
			},
			{
				ref: 2,
				mode: "o",
				x2: -1.54,
				y2: 2.963,
				large: false
			}
		],
		text: {
			x: -3.174,
			y: 1.557
		}
	},
	{
		sets: [
			1,
			4
		],
		x1: 2.988,
		y1: -1.492,
		arcs: [
			{
				ref: 4,
				mode: "i",
				x2: 3.291,
				y2: 1.559,
				sweep: true,
				large: false
			},
			{
				ref: 2,
				mode: "o",
				x2: 2.858,
				y2: 0.659,
				large: false
			},
			{
				ref: 0,
				mode: "o",
				x2: 2.988,
				y2: -1.492,
				large: false
			}
		],
		text: {
			x: 3.483,
			y: 0.606
		}
	},
	{
		sets: [
			2,
			3
		],
		x1: -0.466,
		y1: 3.612,
		arcs: [
			{
				ref: 3,
				mode: "i",
				x2: -0.744,
				y2: 3.837,
				sweep: true,
				large: false
			},
			{
				ref: 2,
				mode: "i",
				x2: -1.54,
				y2: 2.963,
				sweep: true,
				large: false
			},
			{
				ref: 1,
				mode: "o",
				x2: -1,
				y2: 3,
				large: false
			},
			{
				ref: 0,
				mode: "o",
				x2: -0.466,
				y2: 3.612
			}
		],
		text: {
			x: -0.953,
			y: 3.352
		}
	},
	{
		sets: [
			2,
			4
		],
		x1: -3.294,
		y1: -0.549,
		arcs: [
			{
				ref: 2,
				mode: "i",
				x2: -1.746,
				y2: -3.196,
				sweep: true
			},
			{
				ref: 0,
				mode: "o",
				x2: -1.925,
				y2: -2.213
			},
			{
				ref: 3,
				mode: "o",
				x2: -3.294,
				y2: -0.549
			}
		],
		text: {
			x: -2.462,
			y: -2.538
		}
	},
	{
		sets: [
			3,
			4
		],
		x1: -3.579,
		y1: 0.673,
		arcs: [
			{
				ref: 4,
				mode: "i",
				x2: -3.879,
				y2: 0.478,
				sweep: true,
				large: false
			},
			{
				ref: 3,
				mode: "i",
				x2: -3.294,
				y2: -0.549,
				sweep: true,
				large: false
			},
			{
				ref: 2,
				mode: "o",
				x2: -3.162,
				y2: -0.024,
				large: false
			},
			{
				ref: 1,
				mode: "o",
				x2: -3.579,
				y2: 0.673
			}
		],
		text: {
			x: -3.483,
			y: 0.13
		}
	},
	{
		sets: [
			0,
			1,
			2
		],
		x1: 2.544,
		y1: 1.878,
		arcs: [
			{
				ref: 0,
				mode: "i",
				x2: 2.342,
				y2: 2.381,
				sweep: true,
				large: false
			},
			{
				ref: 1,
				mode: "i",
				x2: 0.257,
				y2: 2.922,
				sweep: true,
				large: false
			},
			{
				ref: 3,
				mode: "o",
				x2: 0.983,
				y2: 2.049,
				large: false
			},
			{
				ref: 4,
				mode: "o",
				x2: 2.544,
				y2: 1.878
			}
		],
		text: {
			x: 1.457,
			y: 2.331
		}
	},
	{
		sets: [
			0,
			1,
			3
		],
		x1: 1.51,
		y1: -2.515,
		arcs: [
			{
				ref: 1,
				mode: "i",
				x2: 2.5,
				y2: -2.648,
				sweep: true,
				large: false
			},
			{
				ref: 3,
				mode: "i",
				x2: 2.572,
				y2: -1.839,
				sweep: true,
				large: false
			},
			{
				ref: 4,
				mode: "o",
				x2: 1.51,
				y2: -2.515,
				large: false
			}
		],
		text: {
			x: 2.194,
			y: -2.334
		}
	},
	{
		sets: [
			0,
			1,
			4
		],
		x1: 2.572,
		y1: -1.839,
		arcs: [
			{
				ref: 4,
				mode: "i",
				x2: 2.988,
				y2: -1.492,
				sweep: true,
				large: false
			},
			{
				ref: 0,
				mode: "i",
				x2: 2.858,
				y2: 0.659,
				sweep: true,
				large: false
			},
			{
				ref: 2,
				mode: "o",
				x2: 2.253,
				y2: -0.302,
				large: false
			},
			{
				ref: 3,
				mode: "o",
				x2: 2.572,
				y2: -1.839
			}
		],
		text: {
			x: 2.667,
			y: -0.665
		}
	},
	{
		sets: [
			0,
			2,
			3
		],
		x1: 0.257,
		y1: 2.922,
		arcs: [
			{
				ref: 3,
				mode: "i",
				x2: -0.466,
				y2: 3.612,
				sweep: true,
				large: false
			},
			{
				ref: 0,
				mode: "i",
				x2: -1,
				y2: 3,
				sweep: true,
				large: false
			},
			{
				ref: 1,
				mode: "o",
				x2: 0.257,
				y2: 2.922,
				large: false
			}
		],
		text: {
			x: -0.403,
			y: 3.178
		}
	},
	{
		sets: [
			0,
			2,
			4
		],
		x1: -1.746,
		y1: -3.196,
		arcs: [
			{
				ref: 2,
				mode: "i",
				x2: -0.954,
				y2: -3.015,
				sweep: true,
				large: false
			},
			{
				ref: 3,
				mode: "o",
				x2: -1.925,
				y2: -2.213,
				sweep: false,
				large: false
			},
			{
				ref: 0,
				mode: "i",
				x2: -1.746,
				y2: -3.196,
				sweep: true,
				large: false
			}
		],
		text: {
			x: -1.542,
			y: -2.808
		}
	},
	{
		sets: [
			0,
			3,
			4
		],
		x1: -0.495,
		y1: -3.303,
		arcs: [
			{
				ref: 4,
				mode: "i",
				x2: 1.51,
				y2: -2.515,
				sweep: true,
				large: false
			},
			{
				ref: 1,
				mode: "o",
				x2: 0.409,
				y2: -2.236,
				large: false
			},
			{
				ref: 2,
				mode: "o",
				x2: -0.954,
				y2: -3.015,
				large: false
			},
			{
				ref: 3,
				mode: "i",
				x2: -0.495,
				y2: -3.303
			}
		],
		text: {
			x: 0.192,
			y: -2.742
		}
	},
	{
		sets: [
			1,
			2,
			3
		],
		x1: -1.54,
		y1: 2.963,
		arcs: [
			{
				ref: 2,
				mode: "i",
				x2: -2.7,
				y2: 1.147,
				sweep: true,
				large: false
			},
			{
				ref: 4,
				mode: "o",
				x2: -1.645,
				y2: 1.568,
				large: false
			},
			{
				ref: 0,
				mode: "o",
				x2: -1,
				y2: 3,
				large: false
			},
			{
				ref: 1,
				mode: "i",
				x2: -1.54,
				y2: 2.963
			}
		],
		text: {
			x: -1.767,
			y: 2.106
		}
	},
	{
		sets: [
			1,
			2,
			4
		],
		x1: 2.858,
		y1: 0.659,
		arcs: [
			{
				ref: 2,
				mode: "i",
				x2: 3.291,
				y2: 1.559,
				sweep: true,
				large: false
			},
			{
				ref: 4,
				mode: "i",
				x2: 2.544,
				y2: 1.878,
				sweep: true,
				large: false
			},
			{
				ref: 0,
				mode: "o",
				x2: 2.858,
				y2: 0.659,
				large: false
			}
		],
		text: {
			x: 2.898,
			y: 1.365
		}
	},
	{
		sets: [
			1,
			3,
			4
		],
		x1: -2.7,
		y1: 1.147,
		arcs: [
			{
				ref: 4,
				mode: "i",
				x2: -3.579,
				y2: 0.673,
				sweep: true,
				large: false
			},
			{
				ref: 1,
				mode: "i",
				x2: -3.162,
				y2: -0.024,
				sweep: true,
				large: false
			},
			{
				ref: 2,
				mode: "o",
				x2: -2.7,
				y2: 1.147,
				large: false
			}
		],
		text: {
			x: -3.147,
			y: 0.599
		}
	},
	{
		sets: [
			2,
			3,
			4
		],
		x1: -3.294,
		y1: -0.549,
		arcs: [
			{
				ref: 3,
				mode: "i",
				x2: -1.925,
				y2: -2.213,
				sweep: true,
				large: false
			},
			{
				ref: 0,
				mode: "o",
				x2: -2,
				y2: -1.08,
				large: false
			},
			{
				ref: 1,
				mode: "o",
				x2: -3.162,
				y2: -0.024,
				large: false
			},
			{
				ref: 2,
				mode: "i",
				x2: -3.294,
				y2: -0.549
			}
		],
		text: {
			x: -2.548,
			y: -1.029
		}
	},
	{
		sets: [
			0,
			1,
			2,
			3
		],
		x1: 0.983,
		y1: 2.049,
		arcs: [
			{
				ref: 3,
				mode: "i",
				x2: 0.257,
				y2: 2.922,
				sweep: true,
				large: false
			},
			{
				ref: 1,
				mode: "i",
				x2: -1,
				y2: 3,
				sweep: true,
				large: false
			},
			{
				ref: 0,
				mode: "i",
				x2: -1.645,
				y2: 1.568,
				sweep: true,
				large: false
			},
			{
				ref: 4,
				mode: "o",
				x2: 0.983,
				y2: 2.049
			}
		],
		text: {
			x: -0.407,
			y: 2.31
		}
	},
	{
		sets: [
			0,
			1,
			2,
			4
		],
		x1: 2.253,
		y1: -0.302,
		arcs: [
			{
				ref: 2,
				mode: "i",
				x2: 2.858,
				y2: 0.659,
				sweep: true,
				large: false
			},
			{
				ref: 0,
				mode: "i",
				x2: 2.544,
				y2: 1.878,
				sweep: true,
				large: false
			},
			{
				ref: 4,
				mode: "i",
				x2: 0.983,
				y2: 2.049,
				sweep: true,
				large: false
			},
			{
				ref: 3,
				mode: "o",
				x2: 2.253,
				y2: -0.302
			}
		],
		text: {
			x: 2.071,
			y: 1.101
		}
	},
	{
		sets: [
			0,
			1,
			3,
			4
		],
		x1: 1.51,
		y1: -2.515,
		arcs: [
			{
				ref: 4,
				mode: "i",
				x2: 2.572,
				y2: -1.839,
				sweep: true,
				large: false
			},
			{
				ref: 3,
				mode: "i",
				x2: 2.253,
				y2: -0.302,
				sweep: true,
				large: false
			},
			{
				ref: 2,
				mode: "o",
				x2: 0.409,
				y2: -2.236,
				sweep: false,
				large: false
			},
			{
				ref: 1,
				mode: "i",
				x2: 1.51,
				y2: -2.515,
				sweep: true
			}
		],
		text: {
			x: 1.687,
			y: -1.63
		}
	},
	{
		sets: [
			0,
			2,
			3,
			4
		],
		x1: -2,
		y1: -1.08,
		arcs: [
			{
				ref: 0,
				mode: "i",
				x2: -1.925,
				y2: -2.213,
				sweep: true,
				large: false
			},
			{
				ref: 3,
				mode: "i",
				x2: -0.954,
				y2: -3.015,
				sweep: true,
				large: false
			},
			{
				ref: 2,
				mode: "i",
				x2: 0.409,
				y2: -2.236,
				sweep: true,
				large: false
			},
			{
				ref: 1,
				mode: "o",
				x2: -2,
				y2: -1.08
			}
		],
		text: {
			x: -1.028,
			y: -2.108
		}
	},
	{
		sets: [
			1,
			2,
			3,
			4
		],
		x1: -1.645,
		y1: 1.568,
		arcs: [
			{
				ref: 4,
				mode: "i",
				x2: -2.7,
				y2: 1.147,
				sweep: true,
				large: false
			},
			{
				ref: 2,
				mode: "i",
				x2: -3.162,
				y2: -0.024,
				sweep: true,
				large: false
			},
			{
				ref: 1,
				mode: "i",
				x2: -2,
				y2: -1.08,
				sweep: true,
				large: false
			},
			{
				ref: 0,
				mode: "o",
				x2: -1.645,
				y2: 1.568
			}
		],
		text: {
			x: -2.323,
			y: 0.327
		}
	},
	{
		sets: [
			0,
			1,
			2,
			3,
			4
		],
		x1: 0.409,
		y1: -2.236,
		arcs: [
			{
				ref: 2,
				mode: "i",
				x2: 2.253,
				y2: -0.302,
				sweep: true,
				large: false
			},
			{
				ref: 3,
				mode: "i",
				x2: 0.983,
				y2: 2.049,
				sweep: true,
				large: false
			},
			{
				ref: 4,
				mode: "i",
				x2: -1.645,
				y2: 1.568,
				sweep: true,
				large: false
			},
			{
				ref: 0,
				mode: "i",
				x2: -2,
				y2: -1.08,
				sweep: true
			},
			{
				ref: 1,
				mode: "i",
				x2: 0.409,
				y2: -2.236,
				sweep: true
			}
		],
		text: {
			x: 0,
			y: 0
		}
	}
];
var bb = {
	x: -5.5,
	y: -6,
	width: 11.6,
	height: 11.8
};
var venn5 = {
	sets: sets,
	intersections: intersections,
	bb: bb
};

function layout(sets, bb) {
    const lookup = [venn0, venn1, venn2, venn3, venn4, venn5];
    const r = lookup[Math.min(lookup.length - 1, sets)];
    const f = Math.min(bb.width / r.bb.width, bb.height / r.bb.height);
    const x = f * -r.bb.x + (bb.width - f * r.bb.width) / 2 + bb.x;
    const y = f * -r.bb.y + (bb.height - f * r.bb.height) / 2 + bb.y;
    const mx = (v) => x + f * v;
    const my = (v) => y + f * v;
    return {
        sets: r.sets.map((c) => ({
            ...c,
            cx: mx(c.cx),
            cy: my(c.cy),
            text: {
                x: mx(c.text.x),
                y: my(c.text.y),
            },
            ...(isEllipse(c)
                ? {
                    rx: c.rx * f,
                    ry: c.ry * f,
                }
                : {
                    r: c.r * f,
                }),
        })),
        intersections: r.intersections.map((c) => ({
            text: {
                x: mx(c.text.x),
                y: my(c.text.y),
            },
            x1: mx(c.x1),
            y1: my(c.y1),
            sets: c.sets,
            arcs: c.arcs.map((a) => ({ ...a, x2: mx(a.x2), y2: my(a.y2) })),
        })),
    };
}

function patchController(type, config, controller, elements = [], scales = []) {
    registry.addControllers(controller);
    if (Array.isArray(elements)) {
        registry.addElements(...elements);
    }
    else {
        registry.addElements(elements);
    }
    if (Array.isArray(scales)) {
        registry.addScales(...scales);
    }
    else {
        registry.addScales(scales);
    }
    const c = config;
    c.type = type;
    return c;
}

class VennDiagramController extends DatasetController {
    initialize() {
        super.initialize();
        this.enableOptionSharing = true;
    }
    update(mode) {
        super.update(mode);
        const meta = this._cachedMeta;
        const slices = (meta.data || []);
        this.updateElements(slices, 0, slices.length, mode);
    }
    computeLayout(size) {
        const nSets = Math.log2(this._cachedMeta.data.length + 1);
        return layout(nSets, size);
    }
    updateElements(slices, start, count, mode) {
        const xScale = this._cachedMeta.xScale;
        const yScale = this._cachedMeta.yScale;
        const w = xScale.right - xScale.left;
        const h = yScale.bottom - yScale.top;
        const l = this.computeLayout({
            x: xScale.left,
            y: yScale.top,
            width: w,
            height: h,
        });
        this._cachedMeta._layout = l;
        this._cachedMeta._layoutFont = {
            ...xScale._resolveTickFontOptions(0),
            color: xScale.options.ticks.color,
        };
        const firstOpts = this.resolveDataElementOptions(start, mode);
        const sharedOptions = this.getSharedOptions(firstOpts);
        const includeOptions = this.includeOptions(mode, sharedOptions);
        for (let i = start; i < start + count; i += 1) {
            const slice = slices[i];
            const properties = {
                refs: l.sets,
                ...l.intersections[i],
            };
            if (includeOptions) {
                properties.options = sharedOptions || this.resolveDataElementOptions(i, mode);
            }
            this.updateElement(slice, i, properties, mode);
        }
        this.updateSharedOptions(sharedOptions, mode, firstOpts);
    }
    draw() {
        const meta = this._cachedMeta;
        const elements = meta.data;
        const { ctx } = this.chart;
        elements.forEach((elem) => elem.draw(ctx));
        ctx.save();
        const l = meta._layout;
        const font = meta._layoutFont;
        ctx.textBaseline = 'middle';
        ctx.font = font.string;
        ctx.fillStyle = font.color;
        ctx.textBaseline = 'middle';
        const labels = this.chart.data.labels;
        l.sets.forEach((set, i) => {
            ctx.textAlign = set.align === 'middle' ? 'center' : set.align;
            ctx.textBaseline = set.verticalAlign;
            ctx.fillText(labels[i], set.text.x, set.text.y);
        });
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const values = this.getDataset().data;
        l.intersections.forEach((intersection, i) => {
            ctx.fillText(values[i].value.toLocaleString(), intersection.text.x, intersection.text.y);
        });
        ctx.restore();
    }
}
VennDiagramController.id = 'venn';
VennDiagramController.defaults = {
    dataElementType: ArcSlice.id,
};
VennDiagramController.overrides = {
    plugins: {
        tooltip: {
            callbacks: {
                title() {
                    return '';
                },
                label(item) {
                    var _a, _b;
                    const labels = item.chart.data.labels;
                    const d = (_b = (_a = item.chart.data.datasets) === null || _a === void 0 ? void 0 : _a[item.datasetIndex].data) === null || _b === void 0 ? void 0 : _b[item.dataIndex];
                    return `${labels[item.dataIndex]}: ${d ? d.values || d.value.toLocaleString() : ''}`;
                },
            },
        },
    },
    scales: {
        x: {
            type: 'linear',
            min: -1,
            max: 1,
            display: false,
        },
        y: {
            type: 'linear',
            min: -1,
            max: 1,
            display: false,
        },
    },
};
class VennDiagramChart extends Chart {
    constructor(item, config) {
        super(item, patchController('venn', config, VennDiagramController, ArcSlice, [LinearScale]));
    }
}
VennDiagramChart.id = VennDiagramController.id;

function center(circles) {
    const sumX = circles.reduce((acc, a) => acc + a.x, 0);
    const sumY = circles.reduce((acc, a) => acc + a.y, 0);
    return {
        x: sumX / circles.length,
        y: sumY / circles.length,
    };
}
function shiftPath(path, x, y) {
    if (!path) {
        return path;
    }
    const mapX = (v) => x(Number.parseFloat(v)).toString();
    const mapY = (v) => y(Number.parseFloat(v)).toString();
    const transformedPath = path
        .split('\n')
        .map((line) => {
        const parts = line.trim().split(/[ ,]/);
        if (parts[0] === 'M') {
            return `${parts[0]} ${mapX(parts[1])} ${mapY(parts[2])}`;
        }
        if (parts[0] === 'A') {
            return `${parts.slice(0, 6).join(' ')} ${mapX(parts[6])} ${mapY(parts[7])}`;
        }
        return line;
    })
        .join('\n');
    return transformedPath;
}
function angleAtCircle(p, c) {
    const x = p.x - c.x;
    const y = p.y - c.y;
    return (Math.atan2(y, x) / Math.PI) * 180;
}
function euler(sets, bb) {
    const r = layout$1(sets.map((s) => ({ sets: s.sets, size: s.value })), {
        width: bb.width,
        height: bb.height,
        distinct: true,
    });
    const singleSets = r.filter((d) => d.data.sets.length === 1);
    const setNames = singleSets.map((d) => d.data.sets[0]);
    const setCircles = singleSets.map((d) => d.circles[0]);
    const eulerCenter = center(singleSets.map((d) => d.circles[0]));
    const setData = singleSets.map((d) => {
        const c = d.circles[0];
        const angle = angleAtCircle(c, eulerCenter);
        return {
            cx: c.x + bb.x,
            cy: c.y + bb.y,
            r: c.radius,
            align: angle > 90 ? 'end' : 'start',
            verticalAlign: 'bottom',
            text: pointAtCircle(c.x + bb.x, c.y + bb.y, c.radius * 1.1, angle),
        };
    });
    const asArc = (a) => ({
        x2: a.p1.x + bb.x,
        y2: a.p1.y + bb.y,
        ref: setCircles.findIndex((d) => Math.abs(d.x - a.circle.x) < 0.05 && Math.abs(d.y - a.circle.y) < 0.05),
        sweep: true,
        large: a.width > a.circle.radius,
        mode: 'i',
    });
    return {
        sets: setData,
        intersections: r.map((d) => {
            const { arcs } = d;
            const text = {
                x: d.text.x + bb.x,
                y: d.text.y + bb.y,
            };
            const subSets = d.data.sets.map((subSet) => setNames.indexOf(subSet));
            if (arcs.length === 0) {
                return {
                    sets: subSets,
                    text,
                    x1: 0,
                    y1: 0,
                    arcs: [],
                };
            }
            if (arcs.length === 1) {
                const c = d.arcs[0].circle;
                return {
                    sets: subSets,
                    text,
                    x1: d.arcs[0].p2.x + bb.x,
                    y1: c.y - c.radius + bb.y,
                    arcs: [asArc(d.arcs[0]), Object.assign(asArc(d.arcs[0]), { y2: c.y - c.radius + bb.y })],
                    path: shiftPath(d.distinctPath || d.path, (x) => x + bb.x, (y) => y + bb.y),
                };
            }
            return {
                text,
                sets: subSets,
                x1: d.arcs[0].p2.x + bb.x,
                y1: d.arcs[0].p2.y + bb.y,
                arcs: d.arcs.map((e) => asArc(e)),
                path: shiftPath(d.distinctPath || d.path, (x) => x + bb.x, (y) => y + bb.y),
            };
        }),
    };
}

class EulerDiagramController extends VennDiagramController {
    computeLayout(size) {
        const sets = this._data;
        return euler(sets, size);
    }
}
EulerDiagramController.id = 'euler';
EulerDiagramController.defaults = VennDiagramController.defaults;
class EulerDiagramChart extends Chart {
    constructor(item, config) {
        super(item, patchController('euler', config, EulerDiagramController, ArcSlice));
    }
}
EulerDiagramChart.id = EulerDiagramController.id;

function generateSubset(members, notMembers, lookup) {
    const sets = members.map((s) => s.label);
    const label = sets.join(' ∩ ');
    const others = members.slice(1).map((s) => lookup.get(s));
    const not = notMembers.map((s) => lookup.get(s));
    const values = members[0].values.filter((v) => others.every((o) => o != null && o.has(v)) && not.every((o) => o != null && !o.has(v)));
    return {
        sets,
        label,
        value: values.length,
        values,
        degree: sets.length,
    };
}
function extractSets(data, options = {}) {
    const sets = [];
    const lookup = new Map(data.map((s) => [s, new Set(s.values)]));
    const base = data.slice(0, 5);
    switch (base.length) {
        case 1:
            sets.push(generateSubset([base[0]], [], lookup));
            break;
        case 2:
            sets.push(generateSubset([base[0]], [base[1]], lookup), generateSubset([base[1]], [base[0]], lookup), generateSubset([base[0], base[1]], [], lookup));
            break;
        case 3:
            sets.push(generateSubset([base[0]], [base[1], base[2]], lookup), generateSubset([base[1]], [base[0], base[2]], lookup), generateSubset([base[2]], [base[0], base[1]], lookup), generateSubset([base[0], base[1]], [base[2]], lookup), generateSubset([base[0], base[2]], [base[1]], lookup), generateSubset([base[1], base[2]], [base[0]], lookup), generateSubset([base[0], base[1], base[2]], [], lookup));
            break;
        case 4:
            sets.push(generateSubset([base[0]], [base[1], base[2], base[3]], lookup), generateSubset([base[1]], [base[0], base[2], base[3]], lookup), generateSubset([base[2]], [base[0], base[1], base[3]], lookup), generateSubset([base[3]], [base[0], base[1], base[2]], lookup), generateSubset([base[0], base[1]], [base[2], base[3]], lookup), generateSubset([base[0], base[2]], [base[1], base[3]], lookup), generateSubset([base[0], base[3]], [base[1], base[2]], lookup), generateSubset([base[1], base[2]], [base[0], base[3]], lookup), generateSubset([base[1], base[3]], [base[0], base[2]], lookup), generateSubset([base[2], base[3]], [base[0], base[1]], lookup), generateSubset([base[0], base[1], base[2]], [base[3]], lookup), generateSubset([base[0], base[1], base[3]], [base[2]], lookup), generateSubset([base[0], base[2], base[3]], [base[1]], lookup), generateSubset([base[1], base[2], base[3]], [base[0]], lookup), generateSubset([base[0], base[1], base[2], base[3]], [], lookup));
            break;
        case 5:
            sets.push(generateSubset([base[0]], [base[1], base[2], base[3], base[4]], lookup), generateSubset([base[1]], [base[0], base[2], base[3], base[4]], lookup), generateSubset([base[2]], [base[0], base[1], base[3], base[4]], lookup), generateSubset([base[3]], [base[0], base[1], base[2], base[4]], lookup), generateSubset([base[4]], [base[0], base[1], base[2], base[3]], lookup), generateSubset([base[0], base[1]], [base[2], base[3], base[4]], lookup), generateSubset([base[0], base[2]], [base[1], base[3], base[4]], lookup), generateSubset([base[0], base[3]], [base[1], base[2], base[4]], lookup), generateSubset([base[0], base[4]], [base[1], base[2], base[3]], lookup), generateSubset([base[1], base[2]], [base[0], base[3], base[4]], lookup), generateSubset([base[1], base[3]], [base[0], base[2], base[4]], lookup), generateSubset([base[1], base[4]], [base[0], base[2], base[3]], lookup), generateSubset([base[2], base[3]], [base[0], base[1], base[4]], lookup), generateSubset([base[2], base[4]], [base[0], base[1], base[3]], lookup), generateSubset([base[3], base[4]], [base[0], base[1], base[2]], lookup), generateSubset([base[0], base[1], base[2]], [base[3], base[4]], lookup), generateSubset([base[0], base[1], base[3]], [base[2], base[4]], lookup), generateSubset([base[0], base[1], base[4]], [base[2], base[3]], lookup), generateSubset([base[0], base[2], base[3]], [base[1], base[4]], lookup), generateSubset([base[0], base[2], base[4]], [base[1], base[3]], lookup), generateSubset([base[0], base[3], base[4]], [base[1], base[2]], lookup), generateSubset([base[1], base[2], base[3]], [base[0], base[4]], lookup), generateSubset([base[1], base[2], base[4]], [base[0], base[3]], lookup), generateSubset([base[1], base[3], base[4]], [base[0], base[2]], lookup), generateSubset([base[2], base[3], base[4]], [base[0], base[1]], lookup), generateSubset([base[0], base[1], base[2], base[3]], [base[4]], lookup), generateSubset([base[0], base[1], base[2], base[4]], [base[3]], lookup), generateSubset([base[0], base[1], base[3], base[4]], [base[2]], lookup), generateSubset([base[0], base[2], base[3], base[4]], [base[1]], lookup), generateSubset([base[1], base[2], base[3], base[4]], [base[0]], lookup), generateSubset([base[0], base[1], base[2], base[3], base[4]], [], lookup));
            break;
    }
    return {
        labels: sets.map((s) => s.label),
        datasets: [
            {
                label: options.label || 'Venn Diagram',
                data: sets,
            },
        ],
    };
}

export { ArcSlice, EulerDiagramChart, EulerDiagramController, VennDiagramChart, VennDiagramController, extractSets };
//# sourceMappingURL=index.js.map
