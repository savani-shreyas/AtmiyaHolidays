document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const examType = urlParams.get('exam');

    const examData = {
        ielts: {
            title: 'IELTS (International English Language Testing System)',
            tagline: 'Unlock your global opportunities with IELTS coaching.',
            description: 'The IELTS is designed to help you work, study or migrate to a country where English is the native language. This includes countries such as Australia, Canada, New Zealand, the UK and USA. Your ability to listen, read, write and speak in English will be assessed during the test.',
            image: './asset/images/visa/ielts.png',
            structure: [
                { title: 'Listening (30 mins)', desc: 'Four recorded monologues and conversations.' },
                { title: 'Reading (60 mins)', desc: 'Three long texts which range from the descriptive and factual to the discursive and analytical.' },
                { title: 'Writing (60 mins)', desc: 'Task 1: Describe visual information. Task 2: Write an essay.' },
                { title: 'Speaking (11-14 mins)', desc: 'Face-to-face interview including short questions and long-form discussion.' }
            ]
        },
        pte: {
            title: 'PTE Academic (Pearson Test of English)',
            tagline: 'Fast, flexible and fair computer-based English testing.',
            description: 'PTE Academic is the first entirely computer-based English language test for international study and migration that is accepted across the world. Powered by AI technology, PTE Academic provides a fast and convenient testing solution without human bias.',
            image: './asset/images/visa/ielts.png', // Fallback to same image
            structure: [
                { title: 'Speaking & Writing (77-93 mins)', desc: 'Includes reading aloud, repeating sentences, describing images and writing essays.' },
                { title: 'Reading (32-40 mins)', desc: 'Multiple-choice questions, re-order paragraphs and fill in the blanks.' },
                { title: 'Listening (45-57 mins)', desc: 'Based on audio or video clips which play automatically.' }
            ]
        },
        toefl: {
            title: 'TOEFL (Test of English as a Foreign Language)',
            tagline: 'The most respected English language proficiency test.',
            description: 'The TOEFL iBT test is the premier English-language test for university-level study, work and immigration. It is accepted by more than 11,500 universities and other institutions in over 160 countries, including Australia, Canada, New Zealand, the UK, the United States, and across Europe and Asia.',
            image: './asset/images/visa/ielts.png', // Fallback to same image
            structure: [
                { title: 'Reading (54-72 mins)', desc: 'Read 3 or 4 passages from academic texts and answer questions.' },
                { title: 'Listening (41-57 mins)', desc: 'Listen to lectures, classroom discussions and conversations, then answer questions.' },
                { title: 'Speaking (17 mins)', desc: 'Talk about a familiar topic and discuss material you read and listened to.' },
                { title: 'Writing (50 mins)', desc: 'Read a passage, listen to a recording and then type your response.' }
            ]
        }
    };

    const currentExam = examData[examType] || examData.ielts;

    renderExamDetails(currentExam);
});

function renderExamDetails(data) {
    document.title = `${data.title} - Atmiya Holidays`;
    document.getElementById('exam-title').innerText = data.title;
    document.getElementById('exam-tagline').innerText = data.tagline;
    document.getElementById('exam-desc').innerText = data.description;
    
    const heroSection = document.getElementById('exam-hero');
    heroSection.style.backgroundImage = `url('${data.image}')`;

    const structureContainer = document.getElementById('exam-structure');
    structureContainer.innerHTML = data.structure.map(item => `
        <div class="info-box">
            <h4><i data-lucide="check-circle" style="width:18px;"></i> ${item.title}</h4>
            <p>${item.desc}</p>
        </div>
    `).join('');

    // Re-initialize Lucide icons for injected content
    if (window.lucide) {
        lucide.createIcons();
    }
}
