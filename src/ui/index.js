import addOnUISdk from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";

const BACKEND_URL = "http://localhost:3000";
let currentCanvasId = null;

addOnUISdk.ready.then(async () => {
    console.log("Canvas Add-on is ready.");

    const { runtime } = addOnUISdk.instance;
    const sandboxProxy = await runtime.apiProxy("documentSandbox");

    // Publish as Canvas
    const publishButton = document.getElementById("publishCanvas");
    publishButton.addEventListener("click", async () => {
        try {
            showStatus("Extracting document content...");
            publishButton.disabled = true;

            // Get document content from sandbox
            const documentData = await sandboxProxy.extractDocument();
            
            if (!documentData) {
                throw new Error("Failed to extract document content");
            }

            showStatus("Publishing to Canvas...");

            // Send to backend
            const response = await fetch(`${BACKEND_URL}/api/canvas/publish`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(documentData)
            });

            if (!response.ok) {
                throw new Error("Failed to publish Canvas");
            }

            const result = await response.json();
            currentCanvasId = result.canvasId;

            // Show Canvas link
            document.getElementById("canvasLink").value = result.url;
            document.getElementById("canvasLinkContainer").style.display = "block";
            
            showStatus("Canvas published successfully! Opening viewer...", "success");

            // Enable other features
            document.getElementById("createMilestone").disabled = false;
            
            // Auto-open Canvas viewer (removed separate button)
            setTimeout(() => {
                try {
                    window.open(result.url, '_blank');
                } catch (e) {
                    console.log("Auto-open blocked, use link above");
                }
            }, 500);

        } catch (error) {
            console.error("Error publishing Canvas:", error);
            showStatus("Error: " + error.message, "error");
        } finally {
            publishButton.disabled = false;
        }
    });

    // Create Milestone - Show modal
    const milestoneButton = document.getElementById("createMilestone");
    milestoneButton.addEventListener("click", () => {
        if (!currentCanvasId) {
            showStatus("Please publish as Canvas first", "error");
            return;
        }
        
        // Show milestone modal
        document.getElementById("milestoneModal").style.display = "flex";
        document.getElementById("milestoneName").value = "";
        document.getElementById("milestoneReason").value = "";
        document.getElementById("milestoneName").focus();
    });

    // Milestone modal handlers
    document.getElementById('saveMilestone').addEventListener('click', async () => {
        const name = document.getElementById('milestoneName').value.trim();
        const reason = document.getElementById('milestoneReason').value.trim();
        
        if (!name) {
            showStatus("Please enter a milestone name", "error");
            return;
        }
        
        try {
            showStatus("Creating milestone...");
            document.getElementById("milestoneModal").style.display = "none";

            const response = await fetch(`${BACKEND_URL}/api/milestones/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    canvasId: currentCanvasId,
                    name,
                    reason: reason || "No reason provided"
                })
            });

            if (!response.ok) {
                throw new Error("Failed to create milestone");
            }

            const result = await response.json();
            showStatus(`✓ Milestone "${name}" created successfully!`, "success");
            console.log("Milestone created:", result);

        } catch (error) {
            console.error("Error creating milestone:", error);
            showStatus("Error: " + error.message, "error");
        }
    });
    
    document.getElementById('cancelMilestone').addEventListener('click', () => {
        document.getElementById("milestoneModal").style.display = "none";
    });

    // Enable publish button
    publishButton.disabled = false;
});

// Copy Canvas link
window.copyLink = function() {
    const linkInput = document.getElementById("canvasLink");
    linkInput.select();
    document.execCommand("copy");
    showStatus("Link copied to clipboard!", "success");
};

// Show status message
function showStatus(message, type = "info") {
    const statusDiv = document.getElementById("status");
    const statusMessage = document.getElementById("statusMessage");
    
    statusMessage.textContent = message;
    statusDiv.className = "status-box";
    
    if (type === "success") {
        statusDiv.classList.add("status-success");
    } else if (type === "error") {
        statusDiv.classList.add("status-error");
    } else {
        statusDiv.classList.add("status-info");
    }
    
    statusDiv.style.display = "block";
    
    setTimeout(() => {
        if (type !== "success") {
            statusDiv.style.display = "none";
        }
    }, 3000);
}
