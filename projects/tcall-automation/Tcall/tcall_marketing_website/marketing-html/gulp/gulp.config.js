const gulpPaths = require('./gulp.localhost')
// Required files
const gulpMode = require('gulp-mode')({
	modes: ["production", "development"],
	default: "development",
	verbose: false
});
// Set an environment variable for the current environment (--development || --production)
const environment = gulpMode.development() ? 'development' : 'production';

// default paths 
let path = {
	base: process.cwd(), // './'
	map: `_maps`,
	css: `assets/css/`,
	js: `assets/js/dist/`,
};

// Update the localhost path based on the environment
localhost = {
	production: ``,
	development: (gulpPaths.localhost.siteName === '') ? `` : `/${gulpPaths.localhost.siteName}`,
}

// Main Config
const config = {
	scss: {
		lint: {
			watch: [`./assets/sass/**/*.scss`],
		},
		theme: {
			watch: [`./assets/sass/**/*.scss`, `!./assets/sass/critical/**/*.scss`],
			src: `./assets/sass/styles.scss`,
			name: 'styles.min.css',
			dest: './assets/css',
			// map: {
			// 	path: `../../../${path.map}`
			// }
		},
		critical: {
			watch: [`./assets/sass/critical/**/*.scss`],
			src: [`./assets/sass/critical/**/*.scss`],
			dest: `./assets/css/critical/`,
			map: {
				path: `../../../${path.map}`
			}
		}
	},
	lint: {
		src: [`./assets/sass/**/*.scss`],
		dest: `./assets/sass/`,
		errorlog: `./assets/sass/scss-lint-errors.txt`,
	},
	js: {
		block: {
			watch: ['./assets/js/blocks/src/**/*.js'],
			src: ['./assets/js/blocks/src/**/*.js'],
			dest: './assets/js/blocks/dist/',
			map: {
				path: `./${path.map}`
			}
		},
		vendor: {
			watch: ['./assets/js/vendor/src/**/*.js', '!./assets/js/**/*.min.js'],
			src: ['./assets/js/vendor/src/**/*.js', '!./assets/js/**/*.min.js'],
			dest: './assets/js/vendor/dist/',
			map: {
				path: `./${path.map}`
			}
		},
	},
	imageMin: {
		image: {
			src: './assets/images/**',
			dest: './assets/min-images/',
		},
	},
	imageWebp: {
		image: {
			src: './assets/images/**',
			dest: './assets/min-images/',
		},
	},
	imageResizer: {
		image: {
			src: './assets/images/**',
			dest: './assets/min-images/',
		},
	}
}

module.exports = {
	path: path,
	config: config
}