const urlw = "https://api.cosmicjs.com/v3/buckets/my-project-production-79a15780-938e-11ee-bad3-c399e8060022/objects/659c83116e0560e7c192753a?read_key=7C8tqJzO9S1KnNTyo7v5vs5kHvk9eoUBUpOlEkGFqEzwGodRBj&depth=1&props=slug,title,metadata,";

function fetchWorks() {
    fetch(urlw)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            displayWorks(data.object);
        })
        .catch(error => console.error('Fetching error:', error));
}
function displayWorks(work) {
    const workContainer = document.getElementById('work-container');
    if (!workContainer) {
        console.error("Work container not found!");
        return;
    }

    if (
        work &&
        work.metadata &&
        Array.isArray(work.metadata.link)
    ) {
        const projectList = document.createElement('ul'); // Create an unordered list
        let currentBucket = null;

        work.metadata.link.forEach(project => {
            if (project.metadata.bucket !== currentBucket) {
                // Create a new section title when the bucket changes
                const sectionTitle = document.createElement('h3');
                sectionTitle.innerText = work.title;
                workContainer.appendChild(sectionTitle);
                currentBucket = project.metadata.bucket;
            }

            const projectItem = document.createElement('li'); // Create a list item

            // Create a link for each project name
            const projectLink = document.createElement('a');
            projectLink.innerText = project.title;
            projectLink.href = '#'; // Set the href to '#' to prevent page reload
            
            // Create a container for project info
            const projectInfo = document.createElement('div');
            projectInfo.style.display = 'none'; // Initially hide the project info
            projectInfo.innerHTML = `
                <h3>${project.metadata.sinopse}</h3>
                <img src="${project.metadata.image.url}" alt="${project.title} Image">
                <p>${project.metadata.description}</p>
                <p>Date: ${project.metadata.date}</p>
            `;

            // Show/hide project info when the link is clicked
            projectLink.addEventListener('click', (event) => {
                event.preventDefault(); // Prevent the link from changing the URL
                if (projectInfo.style.display === 'none') {
                    projectInfo.style.display = 'block';
                } else {
                    projectInfo.style.display = 'none';
                }
            });

            // Append the link and info to the list item
            projectItem.appendChild(projectLink);
            projectItem.appendChild(projectInfo);

            // Append the list item to the project list
            projectList.appendChild(projectItem);
        });

        // Append the project list to the work container
        workContainer.appendChild(projectList);
    } else {
        console.error('Invalid object structure:', work);
    }
}
fetchWorks(); // Call fetchWorks to initiate the fetching process