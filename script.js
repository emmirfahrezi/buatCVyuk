const form = document.getElementById("cv-form");
const projectContainer = document.getElementById("projects-container");
const certificationContainer = document.getElementById("certifications-container");
const organizationContainer = document.getElementById("organizations-container");

const previewName = document.getElementById("preview-name");
const previewLinks = document.getElementById("preview-links");
const previewContact = document.getElementById("preview-contact");
const previewProfile = document.getElementById("preview-profile");
const previewEducation = document.getElementById("preview-education");
const previewProjects = document.getElementById("preview-projects");
const previewCertifications = document.getElementById("preview-certifications");
const previewOrganizations = document.getElementById("preview-organizations");
const previewSkills = document.getElementById("preview-skills");
const cvPage = document.getElementById("cv-page");
const sectionProfile = document.getElementById("section-profile");
const sectionEducation = document.getElementById("section-education");
const sectionProjects = document.getElementById("section-projects");
const sectionCertifications = document.getElementById("section-certifications");
const sectionOrganizations = document.getElementById("section-organizations");
const sectionSkills = document.getElementById("section-skills");

function cloneTemplate(templateId) {
  return document.getElementById(templateId).content.firstElementChild.cloneNode(true);
}

function addDynamicItem(type) {
  const map = {
    project: { container: projectContainer, template: "project-template" },
    certification: { container: certificationContainer, template: "certification-template" },
    organization: { container: organizationContainer, template: "organization-template" }
  };

  const target = map[type];
  if (!target) {
    return;
  }

  target.container.appendChild(cloneTemplate(target.template));
  renderPreview();
}

function textValue(name) {
  return form.elements[name]?.value.trim() || "";
}

function multiValue(text) {
  return text
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function linesValue(text) {
  return text
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function fillList(element, items, fallbackText) {
  const data = items.length ? items : [fallbackText];
  element.innerHTML = data.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatUrl(url) {
  if (!url) {
    return "";
  }

  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function getCardData(container, fields) {
  return Array.from(container.querySelectorAll(".dynamic-card"))
    .map((card) => {
      const data = {};
      fields.forEach((field) => {
        data[field] = card.querySelector(`[name="${field}"]`)?.value.trim() || "";
      });
      return data;
    })
    .filter((item) => Object.values(item).some(Boolean));
}

function renderProfile() {
  const profileText = (textValue("profile") || "Tuliskan ringkasan profil diri Anda di sini.")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join(" ");

  previewProfile.innerHTML = `<p>${escapeHtml(profileText)}</p>`;
}

function renderHeader() {
  const fullName = textValue("fullName") || "NAMA LENGKAP";
  const email = textValue("email");
  const phone = textValue("phone");
  const address = textValue("address");
  const linkedin = textValue("linkedin");
  const github = textValue("github");

  previewName.textContent = fullName.toUpperCase();

  const links = [];
  if (linkedin) {
    links.push(
      `<a href="${escapeHtml(formatUrl(linkedin))}" target="_blank" rel="noreferrer">${escapeHtml(linkedin)}</a>`
    );
  }
  if (github) {
    links.push(
      `<a href="${escapeHtml(formatUrl(github))}" target="_blank" rel="noreferrer">${escapeHtml(github)}</a>`
    );
  }

  previewLinks.innerHTML = links.length ? links.join(" | ") : "";

  const contacts = [email, phone, address].filter(Boolean);
  previewContact.textContent = contacts.length
    ? contacts.join(" | ")
    : "";
}

function renderEducation() {
  const school = textValue("school") || "Nama Kampus / Sekolah";
  const major = textValue("major") || "Program Studi";
  const gpa = textValue("gpa");
  const courses = multiValue(textValue("courses"));
  const bullets = [
    `${major} ${school}`.trim(),
    gpa ? `GPA ${gpa}` : "GPA/IPK",
    courses.length ? courses.join(", ") : "Mata kuliah relevan akan tampil di sini."
  ];

  previewEducation.innerHTML = `
    <ul class="cv-list">
      ${bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("")}
    </ul>
  `;
}

function renderProjects() {
  const projects = getCardData(projectContainer, [
    "projectName",
    "projectRole",
    "projectYear",
    "projectDescription"
  ]);

  if (!projects.length) {
    previewProjects.innerHTML = `
      <div class="cv-entry">
        <div class="entry-head">
          <span>Nama Project</span>
          <span>Tahun</span>
        </div>
        <p class="entry-subhead">(Role)</p>
        <p class="cv-description">Deskripsi project akan muncul di sini.</p>
      </div>
    `;
    return;
  }

  previewProjects.innerHTML = projects
    .map((project) => {
      const bullets = linesValue(project.projectDescription);
      return `
        <div class="cv-entry">
          <div class="entry-head">
            <span>${escapeHtml(project.projectName || "Nama Project")}</span>
            <span>${escapeHtml(project.projectYear || "Tahun")}</span>
          </div>
          <p class="entry-subhead">${escapeHtml(project.projectRole ? `(${project.projectRole})` : "(Role)")}</p>
          <p class="cv-description">${escapeHtml(
            (bullets.length ? bullets : ["Deskripsi project akan muncul di sini."]).join(" ")
          )}</p>
        </div>
      `;
    })
    .join("");
}

function renderCertifications() {
  const certifications = getCardData(certificationContainer, [
    "certificationName",
    "certificationIssuer",
    "certificationYear"
  ]);

  if (!certifications.length) {
    previewCertifications.innerHTML = `
      <ul class="cv-list">
        <li>Nama Sertifikasi - Penyelenggara (Tahun)</li>
      </ul>
    `;
    return;
  }

  previewCertifications.innerHTML = `
    <ul class="cv-list">
      ${certifications
        .map((certification) => {
          const title = certification.certificationName || "Nama Sertifikasi";
          const issuer = certification.certificationIssuer || "Penyelenggara";
          const year = certification.certificationYear || "Tahun";
          return `<li>${escapeHtml(`${title} - ${issuer} (${year})`)}</li>`;
        })
        .join("")}
    </ul>
  `;
}

function renderOrganizations() {
  const organizations = getCardData(organizationContainer, [
    "organizationName",
    "organizationRole",
    "organizationYear",
    "organizationDescription"
  ]);

  if (!organizations.length) {
    previewOrganizations.innerHTML = `
      <ul class="cv-list">
        <li>Nama organisasi, posisi, dan deskripsi singkat akan muncul di sini.</li>
      </ul>
    `;
    return;
  }

  previewOrganizations.innerHTML = `
    <ul class="cv-list">
      ${organizations
        .map((organization) => {
          const description = linesValue(organization.organizationDescription).join(" ");
          const parts = [
            organization.organizationName || "Nama Organisasi",
            organization.organizationRole || "Posisi",
            organization.organizationYear || "Tahun",
            description
          ].filter(Boolean);
          return `<li>${escapeHtml(parts.join(", "))}</li>`;
        })
        .join("")}
    </ul>
  `;
}

function renderSkills() {
  const hardSkills = multiValue(textValue("hardSkills"));
  const softSkills = multiValue(textValue("softSkills"));
  const tools = multiValue(textValue("tools"));

  previewSkills.innerHTML = `
    <p class="skills-row"><strong>Hard Skill:</strong> ${escapeHtml(
      hardSkills.length ? hardSkills.join(", ") : "Belum diisi"
    )}</p>
    <p class="skills-row"><strong>Soft Skill:</strong> ${escapeHtml(
      softSkills.length ? softSkills.join(", ") : "Belum diisi"
    )}</p>
    <p class="skills-row"><strong>Tools:</strong> ${escapeHtml(
      tools.length ? tools.join(", ") : "Belum diisi"
    )}</p>
  `;
}

function setSectionVisibility(sectionElement, fieldName) {
  const isVisible = form.elements[fieldName]?.checked ?? true;
  sectionElement.hidden = !isVisible;
}

function renderSectionVisibility() {
  setSectionVisibility(sectionProfile, "showProfile");
  setSectionVisibility(sectionEducation, "showEducation");
  setSectionVisibility(sectionProjects, "showProjects");
  setSectionVisibility(sectionCertifications, "showCertifications");
  setSectionVisibility(sectionOrganizations, "showOrganizations");
  setSectionVisibility(sectionSkills, "showSkills");
}

function renderPreview() {
  renderHeader();
  renderProfile();
  renderEducation();
  renderProjects();
  renderCertifications();
  renderOrganizations();
  renderSkills();
  renderSectionVisibility();
}

function resetDynamicSections() {
  projectContainer.innerHTML = "";
  certificationContainer.innerHTML = "";
  organizationContainer.innerHTML = "";
  addDynamicItem("project");
  addDynamicItem("certification");
  addDynamicItem("organization");
}

document.getElementById("add-project").addEventListener("click", () => addDynamicItem("project"));
document
  .getElementById("add-certification")
  .addEventListener("click", () => addDynamicItem("certification"));
document
  .getElementById("add-organization")
  .addEventListener("click", () => addDynamicItem("organization"));

form.addEventListener("input", renderPreview);
form.addEventListener("change", renderPreview);
form.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove]");
  if (!button) {
    return;
  }

  const card = button.closest(".dynamic-card");
  const parent = card?.parentElement;

  if (!card || !parent) {
    return;
  }

  const totalCards = parent.querySelectorAll(".dynamic-card").length;
  if (totalCards > 1) {
    card.remove();
  } else {
    card.querySelectorAll("input, textarea").forEach((field) => {
      field.value = "";
    });
  }

  renderPreview();
});

form.addEventListener("reset", () => {
  window.setTimeout(() => {
    resetDynamicSections();
    renderPreview();
  }, 0);
});

document.getElementById("download-pdf").addEventListener("click", () => {
  const options = {
    margin: 0,
    filename: `${textValue("fullName") || "CV"}-resume.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
  };

  html2pdf().set(options).from(cvPage).save();
});

resetDynamicSections();
renderPreview();
