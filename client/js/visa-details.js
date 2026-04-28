document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const visaType = urlParams.get('type') || urlParams.get('exam');

    const visaData = {
        tourist: {
            title: 'Tourist Visa',
            tagline: 'Explore the world with our hassle-free tourist visa services.',
            description: 'A tourist visa is a conditional authorization granted by a territory to a foreigner, allowing them to enter, remain within, or to leave that territory for leisure purposes. We provide comprehensive assistance for tourist visas to all major destinations including Europe (Schengen), USA, UK, Canada, Australia, and more.',
            image: './asset/images/Banner/BannerAbout.png',
            structureTitle: 'Requirements',
            structure: [
                { title: 'Valid Passport', desc: 'Must have at least 6 months validity from the date of travel.' },
                { title: 'Financial Proof', desc: 'Bank statements, Income Tax Returns, and other proofs of funds.' },
                { title: 'Travel Itinerary', desc: 'Confirmed flight tickets and hotel bookings.' },
                { title: 'Photographs', desc: 'Recent passport-size photos as per the specific country requirements.' }
            ]
        },
        business: {
            title: 'Business Visa',
            tagline: 'Expand your professional reach globally.',
            description: 'Business visas are for travelers who intend to visit a foreign country for business-related purposes, such as attending meetings, conferences, or exploring business opportunities. We help you navigate the documentation required to demonstrate your professional intent and ensure a smooth application process.',
            image: './asset/images/Banner/BannerAbout.png',
            structureTitle: 'Requirements',
            structure: [
                { title: 'Invitation Letter', desc: 'From the host company or organization in the destination country.' },
                { title: 'Covering Letter', desc: 'From your employer stating the purpose and duration of the visit.' },
                { title: 'Professional Documents', desc: 'Company registration proofs, business profiles, and relevant certificates.' },
                { title: 'Financial Stability', desc: 'Personal and company financial documents showing ability to cover expenses.' }
            ]
        },
        visitor: {
            title: 'Visitor Visa',
            tagline: 'Visit your family and friends abroad.',
            description: 'Visitor visas are typically for individuals traveling to visit family members or friends who are residents or citizens of another country. These visas often require a sponsorship from the host. We provide expert guidance on how to present your ties to your home country and the nature of your visit.',
            image: './asset/images/Banner/BannerAbout.png',
            structureTitle: 'Requirements',
            structure: [
                { title: 'Host Documents', desc: 'Invitation letter, proof of residence, and citizenship/visa copy of the host.' },
                { title: 'Relationship Proof', desc: 'Documents showing your relationship with the host.' },
                { title: 'Social Ties', desc: 'Proof of employment or business in your home country to show intent to return.' },
                { title: 'Sponsorship Proof', desc: 'Financial documents of the host if they are sponsoring your trip.' }
            ]
        }
    };

    const currentVisa = visaData[visaType] || visaData.tourist;

    renderVisaDetails(currentVisa);
});

function renderVisaDetails(data) {
    document.title = `${data.title} - Atmiya Holidays`;
    document.getElementById('exam-title').innerText = data.title;
    document.getElementById('exam-tagline').innerText = data.tagline;
    document.getElementById('exam-desc').innerText = data.description;
    
    const heroSection = document.getElementById('exam-hero');
    heroSection.style.backgroundImage = `url('${data.image}')`;

    const sectionTitle = document.getElementById('structure-section-title');
    if (sectionTitle) {
        sectionTitle.innerHTML = `<i data-lucide="clipboard-list"></i> ${data.structureTitle}`;
    }

    const structureContainer = document.getElementById('exam-structure');
    structureContainer.innerHTML = data.structure.map(item => `
        <div class="info-box">
            <h4><i data-lucide="check-circle" style="width:18px;"></i> ${item.title}</h4>
            <p>${item.desc}</p>
        </div>
    `).join('');

    // Update why-choose section
    const whyChooseSection = document.querySelector('.section-card:last-child h2');
    if (whyChooseSection) whyChooseSection.innerHTML = '<i data-lucide="award"></i> Why Choose Atmiya Holidays?';
    
    const whyChooseItems = document.querySelectorAll('.section-card:last-child .info-box');
    if (whyChooseItems.length >= 4) {
        whyChooseItems[0].querySelector('h4').innerHTML = '<i data-lucide="shield-check"></i> High Success Rate';
        whyChooseItems[0].querySelector('p').innerText = 'Proven track record of successful visa applications across all major countries.';
        
        whyChooseItems[1].querySelector('h4').innerHTML = '<i data-lucide="file-text"></i> Document Assistance';
        whyChooseItems[1].querySelector('p').innerText = 'Meticulous review and assistance with all required documentation.';
        
        whyChooseItems[2].querySelector('h4').innerHTML = '<i data-lucide="user-check"></i> Expert Guidance';
        whyChooseItems[2].querySelector('p').innerText = 'Personalized advice based on the latest immigration rules and trends.';
        
        whyChooseItems[3].querySelector('h4').innerHTML = '<i data-lucide="clock"></i> Quick Processing';
        whyChooseItems[3].querySelector('p').innerText = 'Efficient handling to ensure your application is submitted as soon as possible.';
    }

    // Re-initialize Lucide icons for injected content
    if (window.lucide) {
        lucide.createIcons();
    }
}
