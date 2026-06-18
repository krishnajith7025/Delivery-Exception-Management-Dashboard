document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("exceptionForm");
    const tableBody = document.getElementById("tableBody");
    const message = document.getElementById("message");

    const openCount = document.getElementById("openCount");
    const resolvedCount = document.getElementById("resolvedCount");

    const filterIssueType = document.getElementById("filterIssueType");
    const filterStatus = document.getElementById("filterStatus");

    // Update counts
    function updateCounts() {

        let open = 0;
        let resolved = 0;

        const rows = tableBody.querySelectorAll("tr");

        rows.forEach(row => {

            const status = row.cells[4].textContent;

            if (status === "Open") {
                open++;
            } else {
                resolved++;
            }

        });

        openCount.textContent = open;
        resolvedCount.textContent = resolved;
    }

    // Apply filters
    function applyFilters() {

        const selectedIssue = filterIssueType.value;
        const selectedStatus = filterStatus.value;

        const rows = tableBody.querySelectorAll("tr");

        rows.forEach(row => {

            const issueType = row.cells[2].textContent;
            const status = row.cells[4].textContent;

            let showRow = true;

            if (selectedIssue !== "All" && issueType !== selectedIssue) {
                showRow = false;
            }

            if (selectedStatus !== "All" && status !== selectedStatus) {
                showRow = false;
            }

            if (showRow) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }

        });
    }

    // Form submit
    form.addEventListener("submit", (event) => {

        event.preventDefault();

        const deliveryId = document.getElementById("deliveryId").value;
        const customerName = document.getElementById("customerName").value;
        const issueType = document.getElementById("issueType").value;
        const notes = document.getElementById("notes").value;

        const priorityElement =
            document.querySelector('input[name="priority"]:checked');

        if (
            deliveryId === "" ||
            customerName === "" ||
            issueType === "" ||
            !priorityElement
        ) {
            message.textContent = "Please fill all required fields.";
            return;
        }

        message.textContent = "";

        const priority = priorityElement.value;

        // Create row
        const row = document.createElement("tr");

        if (priority === "High") {
            row.classList.add("high-priority");
        }

        row.innerHTML = `
            <td>${deliveryId}</td>
            <td>${customerName}</td>
            <td>${issueType}</td>
            <td>${priority}</td>
            <td>Open</td>
            <td>
                <button class="resolve-btn">Resolve</button>
                <button class="delete-btn">Delete</button>
            </td>
        `;

        tableBody.appendChild(row);

        updateCounts();

        form.reset();
    });

    // Resolve and Delete using Event Delegation
    tableBody.addEventListener("click", (event) => {

        const target = event.target;

        // Resolve
        if (target.classList.contains("resolve-btn")) {

            const row = target.parentElement.parentElement;

            row.cells[4].textContent = "Resolved";

            row.classList.add("resolved");

            target.disabled = true;
            target.textContent = "Resolved";

            updateCounts();
            applyFilters();
        }

        // Delete
        if (target.classList.contains("delete-btn")) {

            const confirmDelete =
                confirm("Are you sure you want to delete this issue?");

            if (confirmDelete) {

                const row = target.parentElement.parentElement;

                row.remove();

                updateCounts();
            }
        }

    });

    // Filter Events
    filterIssueType.addEventListener("change", applyFilters);

    filterStatus.addEventListener("change", applyFilters);

});