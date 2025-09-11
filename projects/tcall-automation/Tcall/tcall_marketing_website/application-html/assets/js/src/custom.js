document.addEventListener('DOMContentLoaded', () => {
    const leftBar = document.querySelector('.o-dasboard__leftbar');
    const hamMenu = document.querySelector('.o-dasboard__hamburg');
    const overlay = document.querySelector('.o-dasboard__overlay');
    const mainBody = document.querySelector('.o-dasboard');
    const userMenu = document.querySelector('.o-header__usermenu');
    const hamuser = document.querySelector('.o-header__user');
    const arrow = document.querySelector('.o-header__userarrow');
    const openButtons = document.querySelectorAll(".js-open-modal");
    const closeButtons = document.querySelectorAll('.js-modal-close');
    let currentOpenModal = null; // Track the currently open modal

    if (leftBar && hamMenu && hamuser && userMenu || openButtons.length > 0) {
        addEventListeners();
    } else {
        console.error('Elements not found');
    }

    function addEventListeners() {
        hamMenu.addEventListener('click', toggleLeftBar);
        hamuser.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleLeftBar1();
        });

        document.addEventListener('click', handleBodyClick);

        openButtons.forEach(button => {
            button.addEventListener('click', openModal);
        });

        closeButtons.forEach(button => {
            button.addEventListener('click', closeModal);
            });

        document.querySelectorAll('.popup').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target.classList.contains('popup')) {
                    closeModalByElement(modal);
                }
            });
        });
    }

    function toggleLeftBar(e) {
        e.stopPropagation();
        leftBar.classList.toggle('o-dasboard__leftbar--active');
        overlay.classList.toggle('active');
        mainBody.classList.toggle('menu-open');
    }

    function toggleLeftBar1() {
        userMenu.classList.toggle('o-header__usermenu--active');
        arrow.classList.toggle('o-header__userarrow--active');
    }

    function handleBodyClick(e) {
        if (!leftBar.contains(e.target) && !hamMenu.contains(e.target)) {
            if (leftBar.classList.contains('o-dasboard__leftbar--active')) {
                toggleLeftBar(e);
            }
        }

        if (!userMenu.contains(e.target) && !hamuser.contains(e.target)) {
            if (userMenu.classList.contains('o-header__usermenu--active')) {
                toggleLeftBar1();
            }
        }
    }

    function openModal(e) {
        const target = e.currentTarget.getAttribute('data-target');
        const modal = document.querySelector(`.popup[data-modal="${target}"]`);

        if (modal) {
            // Close the currently open modal if there is one
            if (currentOpenModal && currentOpenModal !== modal) {
                closeModalByElement(currentOpenModal);
            }

            modal.style.display = 'flex'; // Show the new modal
            currentOpenModal = modal; // Set the current modal
            document.body.style.overflow = 'hidden';
        } else {
            console.error('Modal not found for target:', target);
        }
    }

    function closeModal(e) {
        const modal = e.currentTarget.closest('.popup');

        if (modal) {
            modal.style.display = 'none';
            currentOpenModal = null; // Clear the current modal
            document.body.style.overflow = 'auto';
        } else {
            console.error('Modal element not found');
        }
    }

    function closeModalByElement(modal) {
        modal.style.display = 'none';
        if (currentOpenModal === modal) {
            currentOpenModal = null; // Clear the current modal if it is the one being closed
        }
    }


    // Tooltip
    // const tooltip = document.createElement("div");
    // tooltip.classList.add("tooltip-js");
    // document.body.appendChild(tooltip);

    // document.querySelectorAll(".tooltip-target").forEach((element) => {
    //     element.addEventListener("mouseover", (e) => {
    //         tooltip.textContent = e.target.dataset.tooltip;
    //         tooltip.style.display = "block";
    //         tooltip.style.left = e.pageX + "px";
    //         tooltip.style.top = e.pageY + "px";

    //         // Add overflow: visible to .o-dashboard__leftbar when tooltip is shown
    //         const leftbar = document.querySelector(".o-dashboard__leftbar");
    //         if (leftbar) {
    //             leftbar.style.overflow = "visible";
    //         }
    //     });

    //     element.addEventListener("mouseout", () => {
    //         tooltip.style.display = "none";

    //         // Optionally reset overflow style when the tooltip is hidden
    //         const leftbar = document.querySelector(".o-dashboard__leftbar");
    //         if (leftbar) {
    //             leftbar.style.overflow = ""; // Resets to default
    //         }
    //     });
    // });

    // INPUT type


});
