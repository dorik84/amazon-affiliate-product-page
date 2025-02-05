import type { ProductData, VariationData } from "@/types/productData";
import { JSDOM, VirtualConsole } from "jsdom";
import { getRandomUserAgent } from "./utils";

export async function fetchAndTransformProduct(url: string): Promise<ProductData> {
  try {
    // Decode the URL if it's encoded
    const decodedUrl = decodeURIComponent(url);

    // Fetch the remote page
    const response = await fetch(decodedUrl, {
      headers: {
        "User-Agent": getRandomUserAgent(),
      },
      cache: "no-store",
      // cache: "force-cache",
    });
    console.log("fetchAndTransformProduct");
    if (!response.ok) {
      throw new Error(`Failed to fetch product page: ${response.statusText}`);
    }

    const html = await response.text();
    // Save HTML to file for debugging
    const fs = require("fs");
    fs.writeFileSync("product-page.txt", html);

    // Create virtual console to suppress CSS errors
    const virtualConsole = new VirtualConsole();
    virtualConsole.sendTo(console, { omitJSDOMErrors: true });

    // Create JSDOM instance with the virtual console
    const dom = new JSDOM(html, {
      virtualConsole,
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
      defaultPrice: 0,
      url: "",
    };

    product.url = url;

    // Extract default price from the apex_desktop container
    const apexDesktop = doc.querySelector("#apex_desktop");
    if (apexDesktop) {
      const wholePart = apexDesktop.querySelector(".a-price .a-price-whole");
      const fractionPart = apexDesktop.querySelector(".a-price .a-price-fraction");
      if (wholePart) {
        const whole = parseFloat(wholePart.textContent?.replace(/[^0-9.-]+/g, "") || "0");
        const fraction = parseFloat(fractionPart?.textContent?.replace(/[^0-9.-]+/g, "") || "0");
        product.defaultPrice = whole + fraction / 100;
      }
    }

    // Extract title from h1#title span
    const titleElement = doc.querySelector("#title span");
    product.title = titleElement?.textContent?.trim() || "";

    // Extract description from product description and facts
    let description = "";

    // Get additional information from product facts
    const productFactsDiv = doc.querySelector("#productFactsDesktop_feature_div");
    if (productFactsDiv) {
      const sections = productFactsDiv.querySelectorAll("h3, h4, h5");
      sections.forEach((section) => {
        description += section.outerHTML + "\n";
        const ulElement = section.nextElementSibling;
        if (ulElement?.tagName.toLowerCase() === "ul") {
          const liElements = ulElement.querySelectorAll("li");
          description += "<ul>\n";
          liElements.forEach((li) => {
            const detailsDiv = li.querySelector(".product-facts-detail");
            if (detailsDiv) {
              // Keep the original structure but ensure consistent styling
              const label = detailsDiv.querySelector(".a-col-left")?.textContent?.trim() || "";
              const value = detailsDiv.querySelector(".a-col-right")?.textContent?.trim() || "";
              description += `  <li>\n    <div class="product-facts-detail" style="display:grid;grid-template-columns:140px 1fr;gap:1rem">\n      <div style="font-weight:600">${label}</div>\n      <div style="font-weight:400">${value}</div>\n    </div>\n  </li>\n`;
            } else {
              description += `  ${li.outerHTML}\n`;
            }
          });
          description += "</ul>\n";
        }
        description += "\n";
      });
    }

    // Get all paragraphs from product description
    const productDescriptionDiv = doc.querySelector("#productDescription");
    if (productDescriptionDiv) {
      const paragraphs = productDescriptionDiv.querySelectorAll("p");
      description += '<h3 class="product-facts-title"> Product Description </h3>';
      paragraphs.forEach((p) => {
        description += p.outerHTML + "\n";
      });
    }

    product.description = description.trim();

    // Extract images from altImages div
    const altImagesDiv = doc.getElementById("altImages");
    const imageElements = altImagesDiv?.querySelectorAll("li.item img") || [];
    imageElements.forEach((elem) => {
      const imgSrc = elem.getAttribute("src");
      if (imgSrc) {
        const fullSizeUrl = imgSrc.replace(/\._.*_\./, "._AC_SX679_.");
        product.images.push(fullSizeUrl);
      }
    });

    // Extract variations from all possible variation containers

    // First check twister_feature_div container
    const twisterFeatureDiv = doc.getElementById("twister_feature_div");
    if (twisterFeatureDiv) {
      const variationTypeDivs = twisterFeatureDiv.querySelectorAll('div[id^="variation_"][id$="_name"]');

      variationTypeDivs.forEach((div) => {
        const divId = div.getAttribute("id") || "";
        const variationType = divId.replace("variation_", "").replace("_name", "");

        // Check for select element first
        const select = div.querySelector("select");
        if (select) {
          const options = select.querySelectorAll("option");
          options.forEach((option) => {
            if (option.value && option.value !== "" && option.textContent?.trim().toLowerCase() !== "select") {
              product.variations.push({
                name: option.textContent?.trim() || "",
                type: variationType,
                price: product.defaultPrice,
                image: "",
                disabled: option.className.toLowerCase().includes("unavailable") || false,
              });
            }
          });
        } else {
          // Check for ul with twisterTextDiv or li elements with images
          const twisterDivs = div.querySelectorAll(".twisterTextDiv");
          const liElements = div.querySelectorAll("li");

          // Handle twisterTextDiv elements
          twisterDivs.forEach((twisterDiv) => {
            const nameElement = twisterDiv.querySelector("p");
            if (nameElement) {
              product.variations.push({
                name: nameElement.textContent?.trim() || "",
                type: variationType,
                price: product.defaultPrice,
                image: "",
                disabled: false,
              });
            }
          });

          // Handle li elements with images
          liElements.forEach((li) => {
            const img = li.querySelector("img");
            if (img) {
              const imgSrc = img.getAttribute("src");
              const imgAlt = img.getAttribute("alt");
              const isDisabled = li.className.toLowerCase().includes("unavailable");

              if (imgAlt) {
                product.variations.push({
                  name: imgAlt.trim(),
                  type: variationType,
                  price: product.defaultPrice,
                  image: imgSrc || "",
                  disabled: isDisabled,
                });
              }
            }
          });
        }
      });
    }

    // Then check inline-twister-row containers
    const variationContainers = doc.querySelectorAll('[id^="inline-twister-row-"]');
    variationContainers.forEach((container) => {
      const containerId = container.getAttribute("id") || "";
      let variationType = "default";

      if (containerId.startsWith("inline-twister-row-")) {
        variationType = containerId.replace("inline-twister-row-", "").replace("_name", "");
      }

      const variationElements = container.querySelectorAll("li");
      variationElements.forEach((li) => {
        const isDisabled = li.classList.contains("unavailable") || li.classList.contains("discontinued");

        // Extract image and price information
        const img = li.querySelector("img");
        const imgAlt = img?.getAttribute("alt");
        const imgUrl = img?.getAttribute("src");
        const priceText =
          li.querySelector('.a-text-price span[aria-hidden="true"]')?.textContent?.replace("$", "").trim() || "0";

        // First try to get text from data-a-html-content as it often contains the complete information
        let dataContentElements: Element[] = [];
        const dataAHtmlContent = li.getAttribute("data-a-html-content");
        if (dataAHtmlContent) {
          try {
            const tempDiv = doc.createElement("div");
            tempDiv.innerHTML = dataAHtmlContent;
            dataContentElements = Array.from(tempDiv.querySelectorAll(".swatch-title-text-display"));
          } catch (err) {
            console.error("Error parsing data-a-html-content:", err);
          }
        }

        // Search for all variation-related elements using multiple strategies
        const swatchTitleDisplayElements = [
          // First priority: elements from data-a-html-content
          ...dataContentElements,
          // Direct class match on the li element itself
          ...Array.from(li.getElementsByClassName("swatch-title-text-display")),
          // Nested within button or its children
          ...Array.from(li.querySelectorAll("button .swatch-title-text-display")),
          // Deep search in all nested spans
          ...Array.from(li.querySelectorAll("span.swatch-title-text-display")),
          // Look for elements with inline styles that might hide the text
          ...Array.from(li.querySelectorAll("[style*='display: none'] .swatch-title-text-display")),
        ];

        // Get text content from elements, ensuring we check all possible locations
        const swatchTitleDisplay = swatchTitleDisplayElements.map((el) => el.textContent?.trim()).filter(Boolean)[0];
        const swatchTitleText = li.querySelector(".swatch-title-text")?.textContent?.trim();

        // Look for additional text content in the root element
        const rootTextContent = li.textContent?.trim()?.replace(/Select\s+/i, "");

        // Extract button-related text
        const button = li.querySelector("button");
        const buttonSpan = button?.querySelector("span");
        const buttonText = button?.textContent
          ?.trim()
          ?.replace(buttonSpan?.textContent || "", "")
          .trim();
        const buttonLabel = button?.getAttribute("aria-label");
        const selectionText = button?.querySelector(".selection")?.textContent?.trim();

        // Extract additional size information
        const sizeElement = li.querySelector("[class*='size'], [class*='dimension']");
        const sizeText = sizeElement?.textContent?.trim();

        // Determine the variation name using all available sources
        const variationName =
          swatchTitleDisplay ||
          swatchTitleText ||
          imgAlt ||
          buttonText ||
          buttonLabel ||
          selectionText ||
          sizeText ||
          rootTextContent ||
          "";

        // Only add variation if there's at least a name or image
        if (variationName || imgUrl) {
          product.variations.push({
            name: variationName || "Unnamed Variation",
            price: parseFloat(priceText) || product.defaultPrice,
            image: imgUrl?.replace(/\._.*_\./, "._AC_SX679_.") || "",
            type: variationType,
            disabled: isDisabled,
          });
        }
        const dropdownText = li.querySelector(".a-dropdown-prompt")?.textContent?.trim();

        // Get various attributes that might contain size info
        const defaultAsin = li.getAttribute("data-defaultasin");
        const dataDpUrl = li.getAttribute("data-dp-url");

        // Extract size from URL if present
        let sizeFromUrl = "";
        if (dataDpUrl) {
          const sizeMatch = dataDpUrl.match(/size=([^&]+)/i);
          if (sizeMatch) {
            sizeFromUrl = decodeURIComponent(sizeMatch[1]);
          }
        }

        // Process HTML content from data attributes
        let dataContentSize = "";
        if (dataAHtmlContent) {
          try {
            const tempDiv = doc.createElement("div");
            tempDiv.innerHTML = dataAHtmlContent;

            // Look for size information in specific order
            dataContentSize =
              // First try specific swatch display text
              tempDiv.querySelector(".swatch-title-text-display")?.textContent?.trim() ||
              // Then try spans that might contain size info
              Array.from(tempDiv.querySelectorAll("span"))
                .map((span) => span.textContent?.trim())
                .filter((text) => text && !text.includes("Select"))
                .join(" ") ||
              // Then try size-specific classes
              tempDiv.querySelector("[class*='size']")?.textContent?.trim() ||
              // Finally use any text content that's not "Select"
              tempDiv.textContent?.trim()?.replace(/Select\s*/g, "") ||
              "";
          } catch (err) {
            console.error("Error parsing data-a-html-content:", err);
          }
        }

        // Extract text from button more carefully
        let buttonContent = "";
        if (button) {
          try {
            // Remove all child element texts from button's text content
            const childTexts = Array.from(button.children)
              .map((child) => child.textContent?.trim() || "")
              .filter(Boolean);

            buttonContent = button.textContent?.trim() || "";
            childTexts.forEach((childText) => {
              buttonContent = buttonContent.replace(childText, "").trim();
            });
            buttonContent = buttonContent.replace(/Select\s*/g, "").trim();
          } catch (err) {
            console.error("Error extracting button content:", err);
          }
        }

        // For size variations, prioritize specific size-related content
        const isSizeVariation = variationType.toLowerCase().includes("size");

        // Clean and prepare potential names
        const cleanButtonLabel = buttonLabel
          ?.split(" - ")?.[0]
          ?.replace(/^Select\s+/i, "")
          ?.trim();
        const cleanDropdownText = dropdownText?.replace(/^Select\s+/i, "")?.trim();
        const cleanRootText = rootTextContent?.replace(/^Select\s+/i, "")?.trim();

        // Extract direct button text (ignoring nested elements)
        const directButtonText = button?.childNodes?.[0]?.textContent?.trim()?.replace(/Select\s*/g, "") || "";

        // Extract any aria-label that doesn't contain "Select"
        const ariaLabels = Array.from(li.querySelectorAll("[aria-label]"))
          .map((el) => el.getAttribute("aria-label"))
          .filter((label) => label && !label.includes("Select"))
          .map((label) => label?.split(" - ")[0]?.trim())
          .filter(Boolean);

        // Build the name with proper priority order for size variations
        let potentialNames = isSizeVariation
          ? [
              swatchTitleDisplay,
              dataContentSize,
              directButtonText,
              sizeText,
              ...ariaLabels,
              buttonContent,
              cleanButtonLabel,
              selectionText,
              cleanDropdownText,
              sizeFromUrl,
              cleanRootText,
            ]
          : [
              swatchTitleDisplay,
              swatchTitleText,
              directButtonText,
              buttonContent,
              cleanButtonLabel,
              selectionText,
              ...ariaLabels,
              cleanDropdownText,
              dataContentSize,
              cleanRootText,
            ];

        // Filter out empty values and "Select"
        potentialNames = potentialNames.filter((text) => text && text !== "Select");

        // Use the first valid name or default to ASIN if nothing else is available
        const name = potentialNames[0] || defaultAsin || "";

        // Create variation if we have a valid name
        if (name) {
          const variation: VariationData = {
            name,
            price: parseFloat(priceText),
            image: imgUrl || "",
            type: variationType,
          };
          product.variations.push(variation);
        }
      });
    });

    return product;
  } catch (error) {
    console.error("Error fetching and transforming product:", error);
    throw error;
  }
}
