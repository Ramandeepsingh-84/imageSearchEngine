alert("Only Limited Images here...")
const accessKey = "p74wzrh74fLjXpIuC7Od3XLHc5ugEFcyVttAemxDWzc";

const searchForm = document.getElementById("search-form");
const searchBox = document.getElementById("search-box");
const searchResult = document.getElementById("search-result");
const showMoreBtn = document.getElementById("show-more-btn");

let keyword = "";
let page = 1;

async function searchImages() {
    keyword = searchBox.value.trim(); // Remove extra spaces

    // If search box is empty, clear results & hide button
    if (keyword === "") {
        searchResult.innerHTML = "";
        showMoreBtn.style.display = "none";
        return;
    }

    const url = `https://api.unsplash.com/search/photos?page=${page}&query=${keyword}&client_id=${accessKey}&per_page=12`;

    const response = await fetch(url);
    const data = await response.json();

    const results = data.results;

    // Clear previous results on first page
    if (page === 1) {
        searchResult.innerHTML = "";
    }

    results.map((result) => {
        // Container div
        const imageContainer = document.createElement("div");
        imageContainer.style.textAlign = "center";

        // Image element
        const image = document.createElement("img");
        image.src = result.urls.small;
        image.alt = result.alt_description || "Image";

        // Image link (to Unsplash page)
        const imageLink = document.createElement("a");
        imageLink.href = result.links.html;
        imageLink.target = "_blank";
        imageLink.appendChild(image);

        imageContainer.appendChild(imageLink);

        // Download Button
        const downloadBtn = document.createElement("button");
        downloadBtn.innerText = "Download";
        downloadBtn.className = "download-btn";
        downloadBtn.style.display = "inline-block";
        downloadBtn.style.marginTop = "10px";
        downloadBtn.style.backgroundColor = "#ff3929";
        downloadBtn.style.color = "#fff";
        downloadBtn.style.padding = "8px 12px";
        downloadBtn.style.borderRadius = "4px";
        downloadBtn.style.textDecoration = "none";
        downloadBtn.style.fontSize = "14px";
        downloadBtn.style.cursor = "pointer";

        // ✅ Download Functionality
        downloadBtn.addEventListener("click", async () => {
            const imageUrl = result.urls.full;
            const fileName = result.id + ".jpg";


            try {
                const imgResponse = await fetch(imageUrl);
                const blob = await imgResponse.blob();

                const link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (error) {
                console.log("Download failed:", error);
            }
        });

        imageContainer.appendChild(downloadBtn);
        searchResult.appendChild(imageContainer);
    });

    // Show or hide 'Show More' button
    if (results.length === 0) {
        showMoreBtn.style.display = "none";
    } else {
        showMoreBtn.style.display = "block";
    }
}

// Search submit
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    page = 1;
    searchImages();
});

// Show more
showMoreBtn.addEventListener("click", () => {
    page++;
    searchImages();
});

// Clear results when input is empty
searchBox.addEventListener("input", () => {
    if (searchBox.value.trim() === "") {
        searchResult.innerHTML = "";
        showMoreBtn.style.display = "none";
    }
});
