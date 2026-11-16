
 // ==========================================
 // CAESAR CIPHER ENCRYPTION TOOL
 // Developed by Mridhula A
 // STAGE 6 - ADVANCED TESTING & SECURITY
 // ==========================================


 // ==========================================
 // 1. GET HTML ELEMENTS
 // ==========================================

 const inputText = document.getElementById("inputText");
 const outputText = document.getElementById("outputText");
 const shiftKey = document.getElementById("shiftKey");

 const encryptBtn = document.getElementById("encryptBtn");
 const decryptBtn = document.getElementById("decryptBtn");

 const clearInput = document.getElementById("clearInput");
 const copyOutput = document.getElementById("copyOutput");

 const charCount = document.getElementById("charCount");
 const outputCount = document.getElementById("outputCount");

 const increaseKey = document.getElementById("increaseKey");
 const decreaseKey = document.getElementById("decreaseKey");

 const historyList = document.getElementById("historyList");
 const clearHistoryBtn = document.getElementById("clearHistory");

 const bruteForceBtn = document.getElementById("bruteForceBtn");
 const bruteForceResults = document.getElementById("bruteForceResults");

 const downloadBtn = document.getElementById("downloadBtn");


 // ==========================================
 // 2. ADVANCED SHIFT KEY VALIDATION
 // ==========================================

 function getValidKey() {

     const value = shiftKey.value.trim();
     const key = Number(value);

     if (
         value === "" ||
         !Number.isSafeInteger(key)
     ) {

         alert("Please enter a valid whole-number shift key.");

         shiftKey.focus();

         return null;
     }

     return key;
 }


 // ==========================================
 // 3. NORMALIZE SHIFT KEY
 // ==========================================

 function normalizeKey(key) {

     return ((key % 26) + 26) % 26;

 }


 // ==========================================
 // 4. CAESAR CIPHER ENCRYPTION
 // ==========================================

 function encryptMessage(message, key) {

     let result = "";

     key = normalizeKey(key);

     for (let i = 0; i < message.length; i++) {

         let char = message[i];

         // Uppercase letters
         if (char >= "A" && char <= "Z") {

             let base = 65;

             let shifted =
                 (char.charCodeAt(0) - base + key) % 26;

             result += String.fromCharCode(shifted + base);

         }

         // Lowercase letters
         else if (char >= "a" && char <= "z") {

             let base = 97;

             let shifted =
                 (char.charCodeAt(0) - base + key) % 26;

             result += String.fromCharCode(shifted + base);

         }

         // Preserve spaces, numbers and symbols
         else {

             result += char;

         }

     }

     return result;

 }


 // ==========================================
 // 5. CAESAR CIPHER DECRYPTION
 // ==========================================

 function decryptMessage(message, key) {

     let result = "";

     key = normalizeKey(key);

     for (let i = 0; i < message.length; i++) {

         let char = message[i];

         // Uppercase letters
         if (char >= "A" && char <= "Z") {

             let base = 65;

             let shifted =
                 (char.charCodeAt(0) - base - key + 26) % 26;

             result += String.fromCharCode(shifted + base);

         }

         // Lowercase letters
         else if (char >= "a" && char <= "z") {

             let base = 97;

             let shifted =
                 (char.charCodeAt(0) - base - key + 26) % 26;

             result += String.fromCharCode(shifted + base);

         }

         // Preserve spaces, numbers and symbols
         else {

             result += char;

         }

     }

     return result;

 }


 // ==========================================
 // 6. CHARACTER COUNTERS
 // ==========================================

 function updateInputCount() {

     const count = inputText.value.length;

     charCount.textContent = count + " characters";

 }


 function updateOutputCount() {

     const count = outputText.value.length;

     outputCount.textContent = count + " characters";

 }


 inputText.addEventListener("input", updateInputCount);


 // ==========================================
 // 7. ENCRYPTION HISTORY
 // ==========================================

 let encryptionHistory = [];

 const HISTORY_LIMIT = 20;


 // Load saved history safely
 function loadHistory() {

     try {

         const savedHistory =
             localStorage.getItem("caesarHistory");

         const parsedHistory =
             JSON.parse(savedHistory || "[]");

         if (Array.isArray(parsedHistory)) {

             encryptionHistory = parsedHistory
                 .filter(function (entry) {

                     return (
                         entry &&
                         typeof entry.type === "string" &&
                         typeof entry.original === "string" &&
                         typeof entry.result === "string" &&
                         Number.isSafeInteger(entry.key) &&
                         typeof entry.time === "string"
                     );

                 })
                 .slice(0, HISTORY_LIMIT);

         }

     }

     catch (error) {

         encryptionHistory = [];

         console.error("Unable to load history:", error);

     }

 }


 // Save history to browser storage
 function persistHistory() {

     try {

         localStorage.setItem(
             "caesarHistory",
             JSON.stringify(encryptionHistory)
         );

         return true;

     }

     catch (error) {

         console.error("Unable to save history:", error);

         alert(
             "History could not be saved in browser storage. " +
             "Your current operation is still available."
         );

         return false;

     }

 }


 // Save an encryption or decryption operation
 function saveHistory(type, original, result, key) {

     const entry = {

         type: type,

         original: original,

         result: result,

         key: key,

         time: new Date().toLocaleString()

     };

     encryptionHistory.unshift(entry);

     encryptionHistory =
         encryptionHistory.slice(0, HISTORY_LIMIT);

     persistHistory();

     displayHistory();

 }


 // Display history safely
 function displayHistory() {

     historyList.textContent = "";

     if (encryptionHistory.length === 0) {

         historyList.textContent = "No operations yet.";

         return;

     }

     encryptionHistory.forEach(function (entry) {

         const item = document.createElement("div");

         item.className = "history-item";

         const heading = document.createElement("strong");

         heading.textContent =
             entry.type + " | Shift Key: " + entry.key;

         const original = document.createElement("p");

         original.textContent =
             "Original: " + entry.original;

         const result = document.createElement("p");

         result.textContent =
             "Result: " + entry.result;

         const time = document.createElement("p");

         time.textContent = entry.time;

         item.append(
             heading,
             original,
             result,
             time
         );

         historyList.appendChild(item);

     });

 }


 // Initialize history
 loadHistory();

 displayHistory();


 // ==========================================
 // 8. ENCRYPT BUTTON
 // ==========================================

 encryptBtn.addEventListener("click", function () {

     const message = inputText.value;

     if (message.trim() === "") {

         alert("Please enter a message to encrypt.");

         inputText.focus();

         return;

     }

     const key = getValidKey();

     if (key === null) return;

     const encrypted = encryptMessage(message, key);

     outputText.value = encrypted;

     updateOutputCount();

     saveHistory(
         "ENCRYPTION",
         message,
         encrypted,
         key
     );

 });


 // ==========================================
 // 9. DECRYPT BUTTON
 // ==========================================

 decryptBtn.addEventListener("click", function () {

     const message = inputText.value;

     if (message.trim() === "") {

         alert("Please enter a message to decrypt.");

         inputText.focus();

         return;

     }

     const key = getValidKey();

     if (key === null) return;

     const decrypted = decryptMessage(message, key);

     outputText.value = decrypted;

     updateOutputCount();

     saveHistory(
         "DECRYPTION",
         message,
         decrypted,
         key
     );

 });


 // ==========================================
 // 10. INCREASE AND DECREASE SHIFT KEY
 // ==========================================

 function changeShiftKey(amount) {

     const key = getValidKey();

     if (key === null) return;

     const newKey = key + amount;

     if (!Number.isSafeInteger(newKey)) {

         alert("Shift key limit reached.");

         return;

     }

     shiftKey.value = newKey;

 }


 increaseKey.addEventListener("click", function () {

     changeShiftKey(1);

 });


 decreaseKey.addEventListener("click", function () {

     changeShiftKey(-1);

 });


 // ==========================================
 // 11. CLEAR INPUT AND OUTPUT
 // ==========================================

 clearInput.addEventListener("click", function () {

     inputText.value = "";

     outputText.value = "";

     updateInputCount();

     updateOutputCount();

     inputText.focus();

 });


 // ==========================================
 // 12. COPY OUTPUT
 // ==========================================

 copyOutput.addEventListener("click", async function () {

     if (outputText.value === "") {

         alert("There is no output to copy.");

         return;

     }

     try {

         if (navigator.clipboard && window.isSecureContext) {

             await navigator.clipboard.writeText(
                 outputText.value
             );

         }

         else {

             outputText.focus();

             outputText.select();

             const copied = document.execCommand("copy");

             if (!copied) {

                 throw new Error("Clipboard copy failed.");

             }

         }

         alert("Message copied successfully!");

     }

     catch (error) {

         console.error("Clipboard error:", error);

         alert(
             "Unable to copy automatically. " +
             "Please select and copy the output manually."
         );

     }

 });


 // ==========================================
 // 13. CLEAR ENCRYPTION HISTORY
 // ==========================================

 clearHistoryBtn.addEventListener("click", function () {

     if (encryptionHistory.length === 0) {

         alert("There is no history to clear.");

         return;

     }

     const confirmed = confirm(
         "Are you sure you want to delete all encryption history?"
     );

     if (!confirmed) return;

     try {

         localStorage.removeItem("caesarHistory");

         encryptionHistory = [];

         displayHistory();

         alert("Encryption history cleared successfully!");

     }

     catch (error) {

         console.error("Unable to clear history:", error);

         alert("Unable to clear browser history storage.");

     }

 });


 // ==========================================
 // 14. BRUTE FORCE ANALYSIS
 // ==========================================

 bruteForceBtn.addEventListener("click", function () {

     const message = inputText.value;

     if (message.trim() === "") {

         alert("Enter an encrypted message first.");

         inputText.focus();

         return;

     }

     bruteForceResults.textContent = "";

     const heading = document.createElement("p");

     heading.textContent =
         "All 26 possible decryption results:";

     heading.style.marginBottom = "12px";

     bruteForceResults.appendChild(heading);


     // Test all 26 possible shift keys
     for (let key = 0; key < 26; key++) {

         const result = decryptMessage(message, key);

         const resultBox = document.createElement("div");

         resultBox.className = "brute-result";

         const keyLabel = document.createElement("strong");

         keyLabel.textContent = "Shift Key: " + key;

         const messageLabel = document.createElement("span");

         messageLabel.textContent = result;

         resultBox.append(
             keyLabel,
             messageLabel
         );

         bruteForceResults.appendChild(resultBox);

     }

 });


 // ==========================================
 // 15. DOWNLOAD ENCRYPTION REPORT
 // ==========================================

 downloadBtn.addEventListener("click", function () {

     if (outputText.value.trim() === "") {

         alert("No result available to download.");

         return;

     }

     let url = null;

     try {

         const report = `

========================================
       CAESAR CIPHER REPORT
========================================

Developed by: Mridhula A

Original Message:
${inputText.value}

Shift Key:
${shiftKey.value}

Processed Result:
${outputText.value}

Generated On:
${new Date().toLocaleString()}

========================================
       END OF REPORT
========================================

Note: Caesar Cipher is an educational
encryption technique and is not suitable
for protecting confidential information.

`;

         const blob = new Blob(
             [report],
             { type: "text/plain;charset=utf-8" }
         );

         url = URL.createObjectURL(blob);

         const link = document.createElement("a");

         link.href = url;

         link.download = "Caesar_Cipher_Report.txt";

         document.body.appendChild(link);

         link.click();

         document.body.removeChild(link);

         alert("Report download started successfully!");

     }

     catch (error) {

         console.error("Download error:", error);

         alert("Unable to download the report. Please try again.");

     }

     finally {

         if (url) {

             setTimeout(function () {

                 URL.revokeObjectURL(url);

             }, 1000);

         }

     }

 });


 // ==========================================
 // 16. INITIALIZE APPLICATION
 // ==========================================

 updateInputCount();

 updateOutputCount();

 console.log("Caesar Cipher Encryption Engine Ready!");

 console.log("Stage 5 Advanced Features Loaded!");

 console.log("Stage 6 Security Improvements Loaded!");

 console.log("Developed by Mridhula A");
