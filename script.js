// Popular Dishes Carousel Scrolling Functionality

document.addEventListener("DOMContentLoaded", function () {
    /* ================= Popular Dishes Carousel ================= */
    const popularDishes = document.getElementById("popularDishes");
    const scrollLeftBtn = document.getElementById("scrollLeft");
    const scrollRightBtn = document.getElementById("scrollRight");

    if (popularDishes && scrollLeftBtn && scrollRightBtn) {
        function getScrollAmount() {
            try {
                const card = popularDishes.querySelector(
                    ".popular-dishes__card"
                );
                if (!card) return 450; // fallback value
                const cardWidth = card.offsetWidth;
                const gap = 48; // 3em ≈ 48px
                return cardWidth + gap;
            } catch (error) {
                console.warn("Error calculating scroll amount:", error);
                return 450; // fallback value
            }
        }

        function scrollCarousel(direction) {
            const scrollAmount = getScrollAmount();
            const scrollValue =
                direction === "left" ? -scrollAmount : scrollAmount;
            popularDishes.scrollBy({ left: scrollValue, behavior: "smooth" });
        }

        function updateButtons() {
            try {
                const { scrollLeft, scrollWidth, clientWidth } = popularDishes;
                const maxScroll = scrollWidth - clientWidth;
                scrollLeftBtn.disabled = scrollLeft <= 0;
                scrollLeftBtn.style.opacity = scrollLeft <= 0 ? "0.5" : "1";
                scrollRightBtn.disabled = scrollLeft >= maxScroll - 1;
                scrollRightBtn.style.opacity =
                    scrollLeft >= maxScroll - 1 ? "0.5" : "1";
            } catch (error) {
                console.warn("Error updating carousel buttons:", error);
            }
        }

        scrollLeftBtn.addEventListener("click", () => scrollCarousel("left"));
        scrollRightBtn.addEventListener("click", () => scrollCarousel("right"));
        popularDishes.addEventListener("scroll", updateButtons);
        setTimeout(updateButtons, 100);
        window.addEventListener("resize", () => setTimeout(updateButtons, 150));
    }

    /* ================= Mobile Navigation ================= */
    const toggle = document.querySelector(".header__toggle");
    const menu = document.getElementById("headerMenu");
    const overlay = document.querySelector(".header__overlay");
    const focusableSelectors =
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    let lastFocusedBeforeOpen = null;

    function openNav() {
        document.body.classList.add("nav-open");
        toggle.setAttribute("aria-expanded", "true");
        lastFocusedBeforeOpen = document.activeElement;
        // Focus first link
        const firstLink = menu.querySelector("a");
        firstLink && firstLink.focus();
        trapFocus();
    }

    function closeNav() {
        document.body.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
        releaseFocus();
        toggle.focus();
    }

    function trapFocus() {
        const focusables = menu.querySelectorAll(focusableSelectors);
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        function handle(e) {
            if (e.key !== "Tab") return;
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
        menu.addEventListener("keydown", handle);
        menu._trapHandler = handle;
    }

    function releaseFocus() {
        if (menu._trapHandler)
            menu.removeEventListener("keydown", menu._trapHandler);
        if (lastFocusedBeforeOpen)
            lastFocusedBeforeOpen.focus({ preventScroll: true });
    }

    function toggleNav() {
        const isOpen = document.body.classList.contains("nav-open");
        isOpen ? closeNav() : openNav();
    }

    if (toggle && menu && overlay) {
        // Ensure proper event handling on all devices
        toggle.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleNav();
        });
        toggle.addEventListener(
            "touchstart",
            (e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleNav();
            },
            { passive: false }
        );
        overlay.addEventListener("click", closeNav);

        document.addEventListener("keydown", (e) => {
            if (
                e.key === "Escape" &&
                document.body.classList.contains("nav-open")
            )
                closeNav();
        });

        // Close when resizing above breakpoint
        window.addEventListener("resize", () => {
            if (
                window.innerWidth > 840 &&
                document.body.classList.contains("nav-open")
            )
                closeNav();
        });

        // Close after clicking a link (and set active state)
        menu.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                menu.querySelectorAll("li").forEach((li) =>
                    li.classList.remove("header__menu-active")
                );
                link.parentElement.classList.add("header__menu-active");
                closeNav();
            });
        });
    }

    /* ================= Scroll Reveal Animations - REMOVED ================= */
    // Scroll reveal animations have been removed for better performance

    /* ================= Enhanced Form Interactions ================= */
    const newsletterForm = document.querySelector(
        ".newsletter-content__subscribe-button"
    );
    const emailInput = document.querySelector(
        ".newsletter-content__subscribe-button--input"
    );
    const submitBtn = document.querySelector(
        ".newsletter-content__subscribe-button--subscribe"
    );

    if (newsletterForm && emailInput && submitBtn) {
        // Add floating label effect
        emailInput.addEventListener("focus", () => {
            newsletterForm.classList.add("focused");
        });

        emailInput.addEventListener("blur", () => {
            if (!emailInput.value) {
                newsletterForm.classList.remove("focused");
            }
        });

        // Enhanced form submission with error handling
        newsletterForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            try {
                if (!emailInput.value || !emailInput.validity.valid) {
                    emailInput.classList.add("error");
                    setTimeout(
                        () => emailInput.classList.remove("error"),
                        2000
                    );
                    return;
                }

                // Show loading state
                submitBtn.innerHTML = '<div class="loading-spinner"></div>';
                submitBtn.disabled = true;

                // Simulate API call
                await new Promise((resolve) => setTimeout(resolve, 1500));

                // Show success state
                submitBtn.innerHTML = "✓ Subscribed!";
                emailInput.value = "";
                newsletterForm.classList.remove("focused");

                setTimeout(() => {
                    submitBtn.innerHTML =
                        'Subscribe <img src="assets/ri_send-plane-fill.png" alt="" />';
                    submitBtn.disabled = false;
                }, 3000);
            } catch (error) {
                console.error("Newsletter subscription error:", error);
                submitBtn.innerHTML = "Error - Try again";
                setTimeout(() => {
                    submitBtn.innerHTML =
                        'Subscribe <img src="assets/ri_send-plane-fill.png" alt="" />';
                    submitBtn.disabled = false;
                }, 3000);
            }
        });
    }

    /* ================= Smooth Scroll for Navigation ================= */
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }
        });
    });

    /* ================= Performance Optimizations ================= */
    // Lazy load images
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.remove("loading");
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    // Observe all images with data-src attribute
    document.querySelectorAll("img[data-src]").forEach((img) => {
        img.classList.add("loading");
        imageObserver.observe(img);
    });

    /* ================= Parallax Effect for Background Elements ================= */
    const parallaxElements = document.querySelectorAll(
        ".hero__bg-leaf__right, .hero__bg-leaf__left"
    );

    window.addEventListener("scroll", () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;

        parallaxElements.forEach((el, index) => {
            const modifier = index % 2 === 0 ? 1 : -1;
            el.style.transform = `translateY(${rate * modifier}px)`;
        });
    });
});
