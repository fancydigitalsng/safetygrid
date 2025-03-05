document.getElementById("emergencyForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const description = document.getElementById("description").value;
    const mediaFile = document.getElementById("media").files[0];
    const statusMessage = document.getElementById("statusMessage");

    if (!mediaFile) {
        statusMessage.innerText = "Please select an image or video.";
        return;
    }

    statusMessage.innerText = "Uploading... Please wait.";

    const storageRef = firebase.storage().ref(`emergencies/${mediaFile.name}`);
    const uploadTask = storageRef.put(mediaFile);

    uploadTask.on("state_changed",
        (snapshot) => {},
        (error) => {
            console.error("Upload failed:", error);
            statusMessage.innerText = "Upload failed. Try again.";
        },
        async () => {
            const mediaURL = await uploadTask.snapshot.ref.getDownloadURL();
            const user = firebase.auth().currentUser;

            const reportData = {
                userId: user ? user.uid : "Anonymous",
                description: description,
                mediaURL: mediaURL,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            };

            firebase.firestore().collection("emergencyReports").add(reportData)
                .then(() => {
                    statusMessage.innerText = "Emergency reported successfully!";
                    document.getElementById("emergencyForm").reset();
                })
                .catch((error) => {
                    console.error("Error saving report:", error);
                    statusMessage.innerText = "Error saving report.";
                });
        }
    );
});

// Report emergency handle images submission //
document.getElementById("emergencyForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const description = document.getElementById("description").value;
    const mediaFile = document.getElementById("media").files[0];
    const statusMessage = document.getElementById("statusMessage");

    if (!mediaFile) {
        statusMessage.innerText = "Please select an image or video.";
        return;
    }

    statusMessage.innerText = "Uploading... Please wait.";

    const storageRef = firebase.storage().ref(`emergencies/${mediaFile.name}`);
    const uploadTask = storageRef.put(mediaFile);

    uploadTask.on("state_changed",
        (snapshot) => {},
        (error) => {
            console.error("Upload failed:", error);
            statusMessage.innerText = "Upload failed. Try again.";
        },
        async () => {
            const mediaURL = await uploadTask.snapshot.ref.getDownloadURL();
            const user = firebase.auth().currentUser;

            const reportData = {
                userId: user ? user.uid : "Anonymous",
                description: description,
                mediaURL: mediaURL,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            };

            firebase.firestore().collection("emergencyReports").add(reportData)
                .then(() => {
                    statusMessage.innerText = "Emergency reported successfully!";
                    document.getElementById("emergencyForm").reset();
                })
                .catch((error) => {
                    console.error("Error saving report:", error);
                    statusMessage.innerText = "Error saving report.";
                });
        }
    );
});
