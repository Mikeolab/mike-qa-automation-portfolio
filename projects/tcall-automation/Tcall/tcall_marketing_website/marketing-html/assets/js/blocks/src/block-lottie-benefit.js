function loadLottieAnimation(className, jsonPath, autoplay = false) {
    // Select all elements with the specified class
    document.querySelectorAll(`.${className}`).forEach(function(webcontainer) {
        if (webcontainer) {
            // Fetch the animation data from the JSON file
            fetch(jsonPath)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok ' + response.statusText);
                    }
                    return response.json();
                })
                .then(animationData => {
                    var params = {
                        container: webcontainer, // Use the webcontainer class element as container
                        renderer: 'svg',
                        loop: true,
                        autoplay: autoplay,
                        animationData: animationData
                    };
                    
                    var anim = lottie.loadAnimation(params);

                    // Store animation in the element for later access
                    webcontainer.animInstance = anim;
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                });
        } else {
            console.error('Web container not found');
        }
    });
}

// Load animations for each class
loadLottieAnimation('home-cta-animation', './assets/lotties/home-cta-animation.json', true);
loadLottieAnimation('banner-line-animation', './assets/lotties/banner-line-animation.json', true);
loadLottieAnimation('banner-text-animation', './assets/lotties/banner-text-animation.json', true);

function randomTwickAnimation() {
    // Select all elements with the class .o-benefits__pointimagepart
    const elements = document.querySelectorAll('.o-benefits__pointimagepart');
    
    // Filter elements to only those inside an active .o-tab__content
    const activeElements = Array.from(elements).filter(element => {
        return element.closest('.o-tab__content.active');
    });
    
    if (activeElements.length > 0) {
        // Select a random element from the active elements
        const randomElement = activeElements[Math.floor(Math.random() * activeElements.length)];
        
        if (randomElement.animInstance) {
            // Play the animation
            randomElement.animInstance.goToAndPlay(0);
            
            // Stop the animation after 5 seconds
            setTimeout(() => {
                randomElement.animInstance.stop();
            }, 5000);
        }
    }
}

setInterval(randomTwickAnimation, 1000);

