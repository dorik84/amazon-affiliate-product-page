import type { ProductData, VariationData } from "@/types/productData";
import { JSDOM, VirtualConsole } from "jsdom";

export async function fetchAndTransformProduct(url: string): Promise<ProductData> {
  try {
    // Decode the URL if it's encoded
    const decodedUrl = decodeURIComponent(url);

    // Fetch the remote page
    const response = await fetch(decodedUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36",
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch product page: ${response.statusText}`);
    }

    const html = await response.text();

    // Create virtual console to suppress CSS errors
    const virtualConsole = new VirtualConsole();

    // Optional: forward other console messages but ignore CSS errors
    virtualConsole.sendTo(console, { omitJSDOMErrors: true });

    // Create JSDOM instance with the virtual console
    const dom = new JSDOM(html, {
      virtualConsole,
      // Disable resource loading and running scripts
      resources: "usable",
      runScripts: "outside-only",
    });

    const doc = dom.window.document;

    // Transform HTML content into structured data
    const product: ProductData = {
      title: "",
      description: "",
      variations: [],
      images: [],
    };

    // Extract title from h1#title span
    const titleElement = doc.querySelector("#title span");
    product.title = titleElement?.textContent?.trim() || "";

    // Extract images from altImages div
    const altImagesDiv = doc.getElementById("altImages");

    const imageElements = altImagesDiv?.querySelectorAll("li.item img") || [];
    imageElements.forEach((elem) => {
      const imgSrc = elem.getAttribute("src");
      if (imgSrc) {
        // Convert thumbnail URL to full-size image URL
        const fullSizeUrl = imgSrc.replace(/\._.*_\./, "._AC_SX679_.");
        product.images.push(fullSizeUrl);
      }
    });

    // Extract variations from all possible variation containers
    const variationContainers = doc.querySelectorAll('[id^="inline-twister-row-"]');
    variationContainers.forEach((container) => {
      const containerId = container.getAttribute("id") || "";
      let variationType = "default";

      if (containerId.startsWith("inline-twister-row-")) {
        variationType = containerId.replace("inline-twister-row-", "").replace("_name", "");
      }

      const variationElements = container.querySelectorAll("li");
      variationElements.forEach((li) => {
        const img = li.querySelector("img");
        const imgAlt = img?.getAttribute("alt");
        const imgUrl = img?.getAttribute("src");
        const priceText =
          li.querySelector('.a-text-price span[aria-hidden="true"]')?.textContent?.replace("$", "").trim() || "0";

        const name = li.querySelector(".swatch-title-text")?.textContent;
        const nameSpare = li.querySelector("swatch-title-text-display")?.textContent;

        const variation: VariationData = {
          name: name || nameSpare || imgAlt || "",
          price: parseFloat(priceText),
          image: imgUrl || "",
          type: variationType,
        };

        product.variations.push(variation);
      });
    });

    // Extract description from feature bullets or product description
    const bulletElements = doc.querySelectorAll("#feature-bullets ul li");
    const featureBullets = Array.from(bulletElements).map((el) => el.textContent?.trim() || "");
    const productDescriptionElement = doc.querySelector("#productDescription p");
    const productDescription = productDescriptionElement?.textContent?.trim() || "";
    product.description =
      featureBullets.length > 0 ? featureBullets.join("\n") : productDescription || "No description available";

    return product;
  } catch (error) {
    console.error("Error fetching and transforming product:", error);
    throw error;
  }
}
