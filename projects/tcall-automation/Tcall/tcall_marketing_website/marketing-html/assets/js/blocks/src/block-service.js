function animationLoader() {
  var params = {
    container: document.getElementById("lottie"),
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: "./assets/lotties/servicebg-animation.json",
  };
  var anim;
  anim = lottie.loadAnimation(params);
}

const circleCreator = (listItems, devationAngle) => {
  const radius = 350; // Radius of the semi-circle (half of the ul width)
  const totalItems = listItems.length;

  const startAngle = devationAngle * (Math.PI / 180);
  const endAngle = (180 - devationAngle) * (Math.PI / 180);

  console.log("START=", startAngle, "END=", endAngle);

  const totalAngleRange = endAngle - startAngle;
  const angleStep = totalAngleRange / (totalItems - 1);

  listItems.forEach((item, index) => {
    const angle = startAngle + index * angleStep;
    const x = radius * Math.cos(angle); // X coordinate
    const y = radius * Math.sin(angle); // Y coordinate

    item.style.setProperty("--initial-x", `${x}px`);
    item.style.setProperty("--initial-y", `${-y}px`);
  });
};

function iconAnimation(listItems, animations) {
  listItems.forEach((item) => {
    const animation = gsap.to(item, {
      x: () => Math.random() * 20 - 10,
      y: () => Math.random() * 20 - 10,

      duration: 2,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      delay: 1,
      paused: true, // Start paused
    });

    animations.push(animation);
    animation.play();

    item.addEventListener("mouseover", () => {
      animation.pause();
      gsap.to(item, { x: 0, y: 0, rotation: 0, duration: 0.3 });
    });

    item.addEventListener("mouseout", () => {
      animation.play();
    });
  });
}

function videoPlayer(playButton, video) {
  video.pause();
  playButton.addEventListener("click", function () {
    if (video.paused) {
      cooldownActive = true;
      const interval = setTimeout(() => {
        video.style.transition = "opacity 1s";
        video.style.opacity = "1";
        video.play();
        video.addEventListener("ended", function () {
          video.style.opacity = "0";
          video.pause();
          video.currentTime = 0;
          clearInterval(interval);
        });
        clearInterval(interval);
      }, 1000);
    }
  });

  // playButton.addEventListener("mouseout", function () {
  //   console.log("out");
  //   video.pause();
  //   video.style.transition = "opacity 1s";
  //   video.style.opacity = "0";
  //   video.currentTime = 0;
  // });
}

document.addEventListener("DOMContentLoaded", function () {
  // Check if window width is greater than 992 pixels
  if (window.innerWidth > 992) {
    let animations = [];
    const playButton = document.getElementById("playVideo");
    const video = document.getElementById("doc_video");
    const litsContainer = document.querySelectorAll(
      "#js-doctor-slide .o-home-service__slideContent__listContainer"
    );
    const litsContainer1 = document.querySelectorAll(
      "#js-patient-slide .o-home-service__slideContent__listContainer"
    );
    const litsContainer2 = document.querySelectorAll(
      "#js-general-slide .o-home-service__slideContent__listContainer"
    );
    const listItems = document.querySelectorAll(
      ".o-home-service__slideContent__item"
    );

    animationLoader();
    circleCreator(litsContainer, 15);
    circleCreator(litsContainer1, 30);
    circleCreator(litsContainer2, 30);
    iconAnimation(listItems, animations);
    videoPlayer(playButton, video);
  }
});
