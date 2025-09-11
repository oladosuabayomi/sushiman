// Popular Dishes Carousel Scrolling Functionality
document.addEventListener("DOMContentLoaded", function () {
    const popularDishes = document.getElementById("popularDishes");
    const scrollLeftBtn = document.getElementById("scrollLeft");
    const scrollRightBtn = document.getElementById("scrollRight");

    // Check if elements exist
    if (!popularDishes || !scrollLeftBtn || !scrollRightBtn) {
        console.error("Carousel elements not found");
        return;
    }

    // Calculate scroll amount (card width + gap)
    function getScrollAmount() {
        const card = popularDishes.querySelector(".popular-dishes__card");
        if (!card) return 450; // fallback value

        const cardWidth = card.offsetWidth;
        const gap = 48; // 3em ≈ 48px
        return cardWidth + gap;
    }

    // Scroll the carousel
    function scrollCarousel(direction) {
        const scrollAmount = getScrollAmount();
        const scrollValue = direction === "left" ? -scrollAmount : scrollAmount;

        popularDishes.scrollBy({
            left: scrollValue,
            behavior: "smooth",
        });
    }

    // Update button states
    function updateButtons() {
        const { scrollLeft, scrollWidth, clientWidth } = popularDishes;
        const maxScroll = scrollWidth - clientWidth;

        // Left button
        scrollLeftBtn.disabled = scrollLeft <= 0;
        scrollLeftBtn.style.opacity = scrollLeft <= 0 ? "0.5" : "1";

        // Right button
        scrollRightBtn.disabled = scrollLeft >= maxScroll - 1;
        scrollRightBtn.style.opacity =
            scrollLeft >= maxScroll - 1 ? "0.5" : "1";
    }

    // Add event listeners
    scrollLeftBtn.addEventListener("click", () => scrollCarousel("left"));
    scrollRightBtn.addEventListener("click", () => scrollCarousel("right"));
    popularDishes.addEventListener("scroll", updateButtons);

    // Initialize
    setTimeout(updateButtons, 100);
});
