/* ============================================
    JAVASCRIPT CODE - The AI brain of the chatbot
    ============================================ */

// -------------------- GLOBAL STATE --------------------
// These variables store the chatbot's current state

let debugMode = false;  // Controls whether to show debug info
let messages = [];      // Array to store all conversation messages

// -------------------- KNOWLEDGE BASE --------------------
// This is the "brain" of the chatbot - all the rules and responses
// Each topic has patterns (what to look for) and a response (what to say)
// IMPORTANT: More specific patterns are placed FIRST to prevent false matches

const knowledgeBase = {
    // ========== SPECIFIC ADMISSION TOPICS (CHECKED FIRST) ==========
    
    // RULE 1: Computer Science Admission Requirements
    csAdmission: {
        patterns: [
            /admission (requirements|requirement) (for|to|into) computer science/i,
            /computer science admission/i,
            /how (do i|to|can i) (apply|get admitted) (to|into) computer science/i,
            /requirements (for|to study) computer science/i,
            /what (do i|does one) need (for|to study) computer science/i
        ],
        response: "Computer Science Admission Requirements:\n\n📋 UTME Requirements:\n• 5 O'level credits including Mathematics, English, Physics, Chemistry and any other Science subject\n• JAMB Score: Minimum of 200\n• JAMB Subjects: Mathematics, Physics, Chemistry, and English\n\n📋 Direct Entry:\n• 2 A'level passes in Mathematics, Physics or Chemistry\n• NCE/ND (Upper Credit) in relevant field\n\n📋 POST-UTME:\n• Must score minimum of 50% in the screening exam\n• Screening covers Mathematics, Physics and General Paper\n\nApplication fee: N2,500"
    },

    // RULE 2: Law Admission Requirements
    lawAdmission: {
        patterns: [
            /admission (requirements|requirement) (for|to|into) law/i,
            /law admission/i,
            /how (do i|to|can i) (apply|get admitted) (to|into) law/i,
            /requirements (for|to study) law/i,
            /what (do i|does one) need (for|to study) law/i
        ],
        response: "Law Admission Requirements:\n\n📋 UTME Requirements:\n• 5 O'level credits including Mathematics, English Language, Literature in English, and any 2 Arts/Social Science subjects\n• JAMB Score: Minimum of 250\n• JAMB Subjects: English, Literature, Government/History, and any other Arts subject\n\n📋 Direct Entry:\n• 2 A'level passes in Arts subjects\n• ND (Upper Credit) or NCE in Law or related field\n\n📋 POST-UTME:\n• Must score minimum of 60% in the screening exam\n• Screening covers English, General Paper and Current Affairs\n\nApplication fee: N2,500\n\nNote: Law is a 5-year program"
    },

    // RULE 3: Mathematics Admission Requirements
    mathAdmission: {
        patterns: [
            /admission (requirements|requirement) (for|to|into) math/i,
            /mathematics admission/i,
            /how (do i|to|can i) (apply|get admitted) (to|into) math/i,
            /requirements (for|to study) math/i,
            /what (do i|does one) need (for|to study) math/i
        ],
        response: "Mathematics Admission Requirements:\n\n📋 UTME Requirements:\n• 5 O'level credits including Mathematics, English, Physics, Chemistry and one other Science subject\n• JAMB Score: Minimum of 180\n• JAMB Subjects: Mathematics, Physics, Chemistry and English\n\n📋 Direct Entry:\n• 2 A'level passes in Mathematics and Physics\n• NCE/ND (Upper Credit) in Mathematics or related field\n\n📋 POST-UTME:\n• Must score minimum of 45% in the screening exam\n• Screening covers Mathematics, Physics and General Paper\n\nApplication fee: N2,500"
    },

    // RULE 4: Engineering Admission Requirements
    engineeringAdmission: {
        patterns: [
            /admission (requirements|requirement) (for|to|into) engineering/i,
            /engineering admission/i,
            /how (do i|to|can i) (apply|get admitted) (to|into) engineering/i,
            /requirements (for|to study) engineering/i,
            /what (do i|does one) need (for|to study) engineering/i
        ],
        response: "Engineering Admission Requirements:\n\n📋 UTME Requirements:\n• 5 O'level credits including Mathematics, English, Physics, Chemistry and Technical Drawing/Further Mathematics\n• JAMB Score: Minimum of 220\n• JAMB Subjects: Mathematics, Physics, Chemistry and English\n\n📋 Direct Entry:\n• 2 A'level passes in Mathematics, Physics and Chemistry\n• ND (Upper Credit) in Engineering or related field\n\n📋 POST-UTME:\n• Must score minimum of 55% in the screening exam\n• Screening covers Mathematics, Physics, Chemistry and Technical Drawing\n\nApplication fee: N2,500\n\nNote: Engineering is a 5-year program"
    },

    // RULE 5: Medicine Admission Requirements
    medicineAdmission: {
        patterns: [
            /admission (requirements|requirement) (for|to|into) medicine/i,
            /medicine (and surgery )?admission/i,
            /mbbs admission/i,
            /how (do i|to|can i) (apply|get admitted) (to|into) medicine/i,
            /requirements (for|to study) medicine/i,
            /what (do i|does one) need (for|to study) medicine/i
        ],
        response: "Medicine & Surgery (MBBS) Admission Requirements:\n\n📋 UTME Requirements:\n• 5 O'level credits in ONE sitting including Mathematics, English, Physics, Chemistry and Biology\n• JAMB Score: Minimum of 260\n• JAMB Subjects: Physics, Chemistry, Biology and English\n\n📋 Direct Entry:\n• 2 A'level passes in Chemistry, Biology and Physics\n• B.Sc with minimum of Second Class (Upper Division) in related Biological Sciences\n\n📋 POST-UTME:\n• Must score minimum of 65% in the screening exam\n• Screening covers Biology, Chemistry, Physics and General Paper\n\nApplication fee: N3,000\n\nNote: Medicine is a 6-year program (5 years + 1 year internship)"
    },

    // RULE 6: Faculty of Science Admission
    scienceFacultyAdmission: {
        patterns: [
            /admission (requirements|requirement) (for|to|into) (the )?faculty of science/i,
            /science faculty admission/i,
            /requirements (for|to|into) science faculty/i,
            /(how to|what are) (apply|requirements) (for|to) science courses/i
        ],
        response: "Faculty of Science Admission Requirements:\n\n📋 General Requirements (All Science Courses):\n• 5 O'level credits including Mathematics, English, Physics, Chemistry and Biology\n• JAMB Score: Minimum of 180-200 (varies by department)\n• JAMB Subjects: Mathematics, Physics, Chemistry and English (Biology for some courses)\n\n📋 Specific Departments:\n• Physics: 180+ JAMB score\n• Chemistry: 180+ JAMB score\n• Biology: 180+ JAMB score, Biology required\n• Statistics: 180+ JAMB score\n• Biochemistry: 190+ JAMB score, Biology required\n\n📋 POST-UTME:\n• Minimum 45-50% pass mark (varies by department)\n• Screening covers relevant science subjects\n\nApplication fee: N2,500"
    },

    // RULE 7: Faculty of Arts Admission
    artsFacultyAdmission: {
        patterns: [
            /admission (requirements|requirement) (for|to|into) (the )?faculty of arts/i,
            /arts faculty admission/i,
            /requirements (for|to|into) arts faculty/i,
            /(how to|what are) (apply|requirements) (for|to) arts courses/i
        ],
        response: "Faculty of Arts Admission Requirements:\n\n📋 General Requirements (All Arts Courses):\n• 5 O'level credits including English Language, Literature in English and 3 other Arts/Social Science subjects\n• JAMB Score: Minimum of 160-180 (varies by department)\n• JAMB Subjects: English, Literature and 2 other Arts subjects\n\n📋 Specific Departments:\n• English & Literature: 180+ JAMB score, Literature required\n• History: 160+ JAMB score\n• Philosophy: 160+ JAMB score\n• Languages: 170+ JAMB score\n• Theatre Arts: 170+ JAMB score\n\n📋 POST-UTME:\n• Minimum 40-45% pass mark\n• Screening covers English, Literature and General Paper\n\nApplication fee: N2,500"
    },

    // RULE 8: Faculty of Social Sciences Admission
    socialScienceAdmission: {
        patterns: [
            /admission (requirements|requirement) (for|to|into) (the )?faculty of social science/i,
            /social science faculty admission/i,
            /requirements (for|to|into) social science faculty/i,
            /(how to|what are) (apply|requirements) (for|to) social science courses/i
        ],
        response: "Faculty of Social Sciences Admission Requirements:\n\n📋 General Requirements:\n• 5 O'level credits including Mathematics, English Language and 3 other Arts/Social Science subjects\n• JAMB Score: Minimum of 180-200 (varies by department)\n• JAMB Subjects: English and 3 relevant Social Science subjects\n\n📋 Specific Departments:\n• Economics: 200+ JAMB, Mathematics required\n• Political Science: 180+ JAMB\n• Sociology: 180+ JAMB\n• Psychology: 190+ JAMB, Biology may be required\n• Mass Communication: 200+ JAMB\n\n📋 POST-UTME:\n• Minimum 45-50% pass mark\n• Screening covers English, Mathematics and General Paper\n\nApplication fee: N2,500"
    },

    // RULE 9: Faculty of Management Sciences Admission
    managementAdmission: {
        patterns: [
            /admission (requirements|requirement) (for|to|into) (the )?faculty of management/i,
            /management (science|sciences) faculty admission/i,
            /requirements (for|to|into) management faculty/i,
            /(how to|what are) (apply|requirements) (for|to) management courses/i,
            /business administration admission/i,
            /accounting admission/i
        ],
        response: "Faculty of Management Sciences Admission Requirements:\n\n📋 General Requirements:\n• 5 O'level credits including Mathematics, English Language, Economics and 2 other subjects\n• JAMB Score: Minimum of 180-200\n• JAMB Subjects: Mathematics, Economics, English and one other Social Science subject\n\n📋 Specific Departments:\n• Accounting: 200+ JAMB, Mathematics required\n• Business Administration: 180+ JAMB\n• Banking & Finance: 190+ JAMB, Mathematics required\n• Marketing: 180+ JAMB\n• Insurance: 180+ JAMB\n\n📋 POST-UTME:\n• Minimum 45-50% pass mark\n• Screening covers Mathematics, Economics and English\n\nApplication fee: N2,500"
    },

    // ========== APPLICATION PROCESS ==========

    // RULE 10: How to Apply to DELSU (Step-by-step)
    applicationProcess: {
        patterns: [
            /how (do i|to|can i) apply to delsu/i,
            /application process (to|for|at) delsu/i,
            /steps to apply (to|for) delsu/i,
            /delsu application procedure/i,
            /how to apply (to|for) admission/i,
            /admission application process/i
        ],
        response: "DELSU Application Process (Step-by-Step):\n\n📝 STEP 1 - JAMB Registration:\n• Register for JAMB UTME\n• Choose DELSU as first choice\n• Select your desired course\n• Score at least the minimum JAMB score for your course\n\n📝 STEP 2 - POST-UTME Registration:\n• Visit DELSU portal: www.delsu.edu.ng\n• Click on 'Apply for POST-UTME'\n• Pay screening fee: N2,500 (N3,000 for Medicine)\n• Generate RRR code and pay at any bank\n• Return to portal to complete registration\n• Print out screening slip\n\n📝 STEP 3 - POST-UTME Screening:\n• Attend screening on scheduled date\n• Bring: Screening slip, JAMB result slip, O'level results\n• Pass with required percentage for your course\n\n📝 STEP 4 - Admission:\n• Check admission status on JAMB CAPS\n• Accept admission on JAMB portal\n• Print admission letter from DELSU portal\n\n📝 STEP 5 - Registration:\n• Pay acceptance fee\n• Complete online registration\n• Pay school fees\n• Collect student ID card\n\n⏰ Application Timeline: September - October"
    },

    // RULE 11: Application Start and End Time
    applicationTimeline: {
        patterns: [
            /when (does|do|is) (the )?application (start|begin|open)/i,
            /application (start|opening) date/i,
            /when (can i|to) apply/i,
            /application deadline/i,
            /when (does|do|is) application (end|close)/i,
            /last date to apply/i
        ],
        response: "DELSU Application Timeline:\n\n📅 POST-UTME Application:\n• Opening Date: First week of September\n• Closing Date: Last week of October\n• Screening Period: October - November\n\n📅 Important Dates:\n• JAMB Registration: February - April\n• JAMB UTME Exam: May - June\n• DELSU POST-UTME Form Sales: September - October\n• POST-UTME Screening: October - November\n• Admission List Release: November - December\n• Registration Period: November - December\n\n⚠️ Note: Exact dates vary each year. Always check:\n• DELSU official website: www.delsu.edu.ng\n• DELSU social media pages\n• JAMB portal: www.jamb.gov.ng\n\n💡 Tip: Apply early! Don't wait until the deadline."
    },

    // ========== GENERAL INFORMATION ==========

    // RULE 12: Course Information
    courses: {
        patterns: [
            /what (courses|classes|subjects) (do you|are) (offer|available|teach)/i,
            /tell me about (the )?courses/i,
            /what can i study/i,
            /course (list|offerings)/i,
            /available courses/i
        ],
        response: "We offer courses in Computer Science, Mathematics, Physics, Chemistry, Biology, English Literature, History, Law, Philosophy, Economics, Pharmacy, Medicine and Surgery, SLT, Engineering, Pharmacology, Business Administration and so many more."
    },
    
    // RULE 13: Course Fees
    courseFees: {
        patterns: [
            /how much (does|do|is|are) (the )?(course|class|tuition|school) (cost|fee|fees)/i,
            /what (is|are) the (course|tuition) (fee|cost|price|fees)/i,
            /price of courses/i,
            /school fees/i,
            /tuition cost/i
        ],
        response: "Course fees vary by program:\n• Undergraduate courses: N200,000 - N350,000 per session\n• Graduate courses: N350,000 per semester\n\nNote: Fees may vary by faculty. Medicine and Engineering typically have higher fees."
    },

    // RULE 14: Application Fees & Costs
    fees: {
        patterns: [
            /(how\s+much|what)\s+(is|are|cost)\s+(the\s+)?(application|admission|screening)\s+(fee|fees|cost)/i,
            /(application|admission|post[-\s]?utme)\s+(fee|fees|cost|charges?)/i,
            /how\s+much\s+to\s+apply\s+(to|at|for)?\s*delsu/i,
            /delsu\s+application\s+(cost|fee)/i,
            /payment\s+for\s+application\s+(at|to)?\s*delsu/i,
            /school\s+fees\s+(at|in)?\s*delsu/i,
            /tuition\s+(at|in)?\s*delsu/i
        ],
        response: "DELSU Application & Admission Fees:\n\n💰 POST-UTME Screening Form:\n• Science/Engineering: ₦2,500\n• Arts/Social Sciences: ₦2,500\n• Medicine: ₦3,000\n• Law: ₦2,500\n\n💰 Acceptance Fee (After Admission):\n• Fresh Students: ₦60,000 (approximately)\n• May vary by faculty\n\n💰 School Fees (Per Session):\n• Varies by faculty: ₦250,000 - ₦350,000\n• Medicine/Engineering typically higher\n• Does not include accommodation\n\n💰 Other Fees:\n• Accommodation: ₦60,000 - ₦100,000/year\n• Medical: ₦5,000\n• Departmental fees: Varies\n\n⚠️ Note: Fees are subject to change. Check official portal for current rates.\n🔗 www.delsu.edu.ng"
    },

    // RULE 15: Library Hours
    libraryHours: {
        patterns: [
            /(what|when) (are|is) (the )?library (hours|timings|open)/i,
            /when (does|is) the library (open|close)/i,
            /library schedule/i,
            /library opening time/i
        ],
        response: "The library is open Monday-Friday: 8:00 AM - 10:00 PM, Saturday-Sunday: 10:00 AM - 6:00 PM. During exam weeks, we extend hours until midnight."
    },

    // RULE 16: Borrowing Books
    libraryBooks: {
        patterns: [
            /how many books can i (borrow|check out|take)/i,
            /(what is|what's) the (book )?borrowing limit/i,
            /how long can i (keep|borrow) (a )?book/i,
            /borrow books/i
        ],
        response: "Students can borrow up to 5 books at a time for 2 weeks. Books can be renewed twice if no one else has requested them. Late fees are N500 per day."
    },

    // RULE 17: Library Card
    libraryCard: {
        patterns: [
            /how (do i|to) get (a )?library card/i,
            /library card (application|process)/i,
            /need a library card/i,
            /obtain library card/i
        ],
        response: "To get a library card, visit the library front desk with your stamped school fees breakdown. Cards are issued free of charge and are valid for your entire enrollment period."
    },

    // RULE 18: How to Apply for Scholarships (SPECIFIC)
    scholarshipApplication: {
        patterns: [
            /how (do i|to|can i) apply (for|to) (a )?scholarship/i,
            /scholarship application (process|procedure|steps)/i,
            /apply (for )?scholarship/i,
            /steps to get scholarship/i,
            /scholarship application form/i
        ],
        response: "📋 HOW TO APPLY:\n• Maintain excellent academic performance (CGPA 3.5+)\n• Monitor scholarship announcements on notice boards\n• Check Student Affairs Office regularly\n• Visit: www.delsu.edu.ng/scholarships\n• Email: studentaffairs@delsu.edu.ng\n\n💡 TIPS:\n• Apply early when applications open\n• Keep academic records up to date\n• Prepare required documents in advance\n• Follow application instructions carefully."
    },

    // RULE 19: General Admission Requirements (FALLBACK)
    admission: {
        patterns: [
            /general admission requirements/i,
            /admission requirement/i,
            /what (are|is) the requirements/i,
            /basic requirements/i
        ],
        response: "General Admission Requirements:\n• Completed application form\n• WAEC/NECO Results (5 credits including English & Mathematics)\n• JAMB Admission Letter\n• POST-UTME Results\n• Minimum JAMB score (varies by course: 160-260)\n• Valid email and phone number\n\nFor specific requirements by department, ask about:\n• Computer Science\n• Law\n• Mathematics\n• Engineering\n• Medicine\n• Or any specific faculty"
    },

    // RULE 20: Admission Status
    admissionStatus: {
        patterns: [
            /are (you) (offering|enrolling|taking) admissions/i,
            /has (admissions|enrollment) (started|begun|ended)/i,
            /admission deadline/i,
            /are admissions open/i,
            /(are|is) admissions (ongoing|in progress)/i
        ],
        response: "Admissions into DELSU begins from September to October every year. You must have passed through POST-UTME to be considered for admissions.\n\nCurrent Status: Applications open in September\n\nCheck www.delsu.edu.ng for updates."
    },

    // RULE 21: Contact Information
    contact: {
        patterns: [
            /(what is|what's) (the )?(school|college|university) (contact|phone|email|address)/i,
            /how (can|do) i contact (you|the school)/i,
            /contact (information|details)/i,
            /phone number/i,
            /email address/i
        ],
        response: "You can reach us at:\n\n📞 Phone: (234) 7019338740\n📧 Email: delsuinfo@school.edu\n📍 Address: PMB 1, Abraka, Delta State, Nigeria\n🌐 Website: www.delsu.edu.ng\n\nOffice hours: 9 AM - 5 PM, Monday-Friday.\n\n💡 TIP: For faster response, email is usually more reliable than phone calls. Include your name, student ID (if applicable), and clear subject line."
    },

    // RULE 22: Scholarships (General Info)
    scholarship: {
        patterns: [
            /(do\s+you\s+have|are\s+there\s+any|about|tell\s+me\s+about|information\s+on)\s+scholarship/i,
            /how\s+(do\s+i|to|can\s+i)\s+(get|apply\s+for|obtain)\s+(a\s+)?scholarship/i,
            /scholarship\s+(opportunities|programs|information|application)/i,
            /financial\s+aid\s+(at|in)?\s*delsu/i,
            /bursary\s+(at|in)?\s*delsu/i,
            /delsu\s+scholarship/i
        ],
        response: "DELSU Scholarship & Financial Aid Opportunities:\n\n🎓 INTERNAL SCHOLARSHIPS:\n\n1️⃣ Merit-Based Scholarship:\n• Awarded to top-performing students\n• Criteria: CGPA 4.50+ (out of 5.0)\n• Covers partial/full tuition\n• Automatic consideration each session\n\n2️⃣ Departmental Awards:\n• Best graduating students\n• Special recognition awards\n• Varies by department\n\n3️⃣ Indigent Students Fund:\n• For financially challenged students\n• Application through Student Affairs\n• Proof of financial need required\n\n🏛️ EXTERNAL SCHOLARSHIPS:\n\n1️⃣ Delta State Government Scholarship:\n• For indigenes of Delta State\n• Application: www.deltastate.gov.ng\n• Annual application (usually July-September)\n\n2️⃣ Federal Government Scholarships:\n• Nigerian Universities Scholarship\n• Bilateral Education Agreement (BEA) Scholarships\n• Apply through Federal Ministry of Education\n\n3️⃣ Private Scholarships:\n• Shell Petroleum Development Company (SPDC)\n• MTN Foundation Scholarship\n• Agbami Scholarship\n• Total E&P Scholarship\n• Various NGO scholarships."
    },

    // RULE 23: Academic Calendar
    calendar: {
        patterns: [
            /when (does|is) (the )?(semester|term|school year|academic year) (start|begin)/i,
            /(academic|school) calendar/i,
            /important dates/i,
            /session dates/i,
            /academic calender/i,
            /when (does|is) (semester|school year) (resume|start|begin)/i
        ],
        response: "DELSU Academic Calendar (Typical Session):\n\n📅 FIRST SEMESTER:\n• Resumption: November (1st week)\n• Lectures Begin: November (2nd week)\n• Lectures End: Late February\n• Revision Week: Early March\n• Examinations: Mid March - Early April\n• Semester Break: April(2 weeks)\n\nDuration: 18-20 weeks\n\n📅 SECOND SEMESTER:\n• Resumption: Mid April\n• Lectures Begin: April\n• Lectures End: Late June\n• Revision Week: Late June\n• Examinations: July\n• Long Vacation: August - October\n\nDuration: 18-20 weeks\n\n🏖️ BREAKS & HOLIDAYS:\n• Christmas Break: 2 weeks\n• Long Vacation: 8-12 weeks\n• Public Holidays: As declared\n\n⚠️ IMPORTANT NOTES:\n• Calendar subject to change - check official portal\n• Medical students may have different calendar\n• Industrial Training (IT) usually during long vacation\n• Registration closes 4 weeks after resumption\n• Late registration attracts penalty fees."
    },

     // RULE 24: About DELSU (General Information)
    aboutDelsu: {
        patterns: [
            /(tell\s+me|what\s+is|about|information)\s+(about\s+)?delsu/i,
            /delsu\s+(history|background|information)/i,
            /(what|which)\s+(kind\s+of|type\s+of)\s+(university|school)\s+is\s+delsu/i,
            /when\s+was\s+delsu\s+(established|founded|created)/i,
            /about\s+delta\s+state\s+university/i
        ],
        response: "About Delta State University (DELSU):\n\n🎓 OVERVIEW:\nDelta State University (DELSU) is a state-owned university located in Abraka and Oleh, Delta State, Nigeria.\n\n📅 ESTABLISHED: 1992\n• Founded by Delta State Government\n• Started academic activities: October 1992\n• First Vice Chancellor: Prof. S.C. Uche\n\n🏛️ CAMPUSES:\n1️⃣ Abraka Campus (Main):\n• Houses most faculties\n• Main administrative offices\n\n2️⃣ Oleh Campus:\n• Faculty of Law\n• Faculty of Engineering\n\n📊 ACCREDITATION:\n• Fully accredited by NUC (National Universities Commission)\n• All programs accredited by relevant professional bodies\n• Member of Association of Commonwealth Universities (ACU)\n• Member of Association of African Universities (AAU)\n\n📈 STATISTICS:\n• 15 Faculties\n• 83 Programs\n• 37,000+ Student Population (approx.)\n• 800+ Academic Staff\n• 1,500+ Non-Academic Staff\n\n🏆 ACHIEVEMENTS:\n• Top-ranked state university in South-South Nigeria\n• Strong research output\n• Excellent graduate employability\n• Active industry partnerships\n\n🎯 VISION:\n\"To be a university of excellence, providing world-class education and producing graduates who will be leaders in their chosen fields.\"\n\n🎯 MISSION:\n\"To provide quality tertiary education through effective teaching, research, and community service.\"\n\n🌟 CORE VALUES:\n• Excellence\n• Integrity\n• Innovation\n• Service\n• Accountability"
    },

    // RULE 25: Specific Course Durations (MORE SPECIFIC - CHECKED FIRST)
    
    // Computer Science Duration
    csDuration: {
        patterns: [
            /how (many|long) years (for|to complete|does it take|is) computer science/i,
            /duration of computer science/i,
            /how long (is|does) computer science (take|last)/i,
            /years (needed|required) for computer science/i
        ],
        response: "Computer Science Duration:\n• B.Sc Computer Science: 4 years\n• Direct Entry: 3 years\n\nProgram Structure:\n• Year 1-2: Foundation courses (Programming, Mathematics, Physics)\n• Year 3-4: Advanced topics (AI, Databases, Networks, Software Engineering)\n• Final Year Project required\n\nFor part-time students: 5-6 years"
    },

    // Law Duration
    lawDuration: {
        patterns: [
            /how (many|long) years (for|to complete|does it take|is) law/i,
            /duration of law/i,
            /how long (is|does) law (take|last)/i,
            /years (needed|required) for law/i,
            /llb duration/i
        ],
        response: "Law (LLB) Duration:\n• LLB Program: 5 years\n• Direct Entry: 4 years\n\nProgram Structure:\n• Years 1-4: Legal studies at DELSU\n• Year 5: Nigerian Law School (mandatory)\n• After completion: Call to Bar ceremony\n\nTotal time to become a practicing lawyer: 6 years (5 years LLB + 1 year Law School)"
    },

    // Medicine Duration
    medicineDuration: {
        patterns: [
            /how (many|long) years (for|to complete|does it take|is) medicine/i,
            /duration of medicine/i,
            /how long (is|does) medicine (take|last)/i,
            /years (needed|required) for medicine/i,
            /mbbs duration/i
        ],
        response: "Medicine (MBBS) Duration:\n• MBBS Program: 6 years\n\nProgram Structure:\n• Years 1-2: Pre-clinical (Basic Medical Sciences)\n• Years 3-5: Clinical rotations (Hospital training)\n• Year 6: Internship/Housemanship\n\nAfter graduation:\n• 1 year mandatory internship\n• NYSC service year\n• Residency training (3-6 years for specialization)\n\nTotal: 6 years to become a general medical doctor"
    },

    // Engineering Duration
    engineeringDuration: {
        patterns: [
            /how (many|long) years (for|to complete|does it take|is) engineering/i,
            /duration of engineering/i,
            /how long (is|does) engineering (take|last)/i,
            /years (needed|required) for engineering/i
        ],
        response: "Engineering Duration:\n• B.Eng Program: 5 years\n• Direct Entry: 4 years\n\nProgram Structure:\n• Year 1: Foundation/Basic Engineering\n• Years 2-4: Core Engineering courses\n• Year 5: Industrial Training (6 months) + Final Year Project\n\nEngineering Disciplines (all 5 years):\n• Civil Engineering\n• Mechanical Engineering\n• Electrical/Electronics Engineering\n• Chemical Engineering\n\nNote: Must complete 6 months SIWES (Industrial Training)"
    },

    // Mathematics Duration
    mathDuration: {
        patterns: [
            /how (many|long) years (for|to complete|does it take|is) math/i,
            /duration of math/i,
            /how long (is|does) math (take|last)/i,
            /years (needed|required) for math/i
        ],
        response: "Mathematics Duration:\n• B.Sc Mathematics: 4 years\n• Direct Entry: 3 years\n\nProgram Structure:\n• Year 1-2: Foundation (Calculus, Algebra, Statistics)\n• Year 3-4: Advanced topics (Real Analysis, Abstract Algebra, Numerical Methods)\n• Final Year Project required\n\nRelated Programs (4 years):\n• Statistics: 4 years\n• Mathematics & Economics: 4 years\n• Mathematics & Computer Science: 4 years"
    },

    // Pharmacy Duration
    pharmacyDuration: {
        patterns: [
            /how (many|long) years (for|to complete|does it take|is) pharmacy/i,
            /duration of pharmacy/i,
            /how long (is|does) pharmacy (take|last)/i,
            /years (needed|required) for pharmacy/i,
            /pharm\.?d duration/i
        ],
        response: "Pharmacy Duration:\n• B.Pharm Program: 5 years\n\nProgram Structure:\n• Years 1-3: Pharmaceutical sciences (Chemistry, Pharmacology, Pharmaceutics)\n• Year 4: Advanced studies and research\n• Year 5: Clinical rotations and industrial training\n\nAfter graduation:\n• 1 year mandatory internship\n• Professional registration exam (PCN)\n• NYSC service year\n\nTotal: 5 years + 1 year internship to practice"
    },

    // Nursing Duration
    nursingDuration: {
        patterns: [
            /how (many|long) years (for|to complete|does it take|is) nursing/i,
            /duration of nursing/i,
            /how long (is|does) nursing (take|last)/i,
            /years (needed|required) for nursing/i
        ],
        response: "Nursing Duration:\n• B.NSc (Bachelor of Nursing Science): 5 years\n\nProgram Structure:\n• Years 1-2: Basic sciences and nursing fundamentals\n• Years 3-4: Clinical nursing practice (Hospital rotations)\n• Year 5: Community health and specialized nursing\n• Clinical postings throughout all years\n\nAfter graduation:\n• Professional registration with Nursing & Midwifery Council\n• NYSC service year\n\nTotal: 5 years to become a registered nurse"
    },

    // Accounting/Business Duration
    accountingDuration: {
        patterns: [
            /how (many|long) years (for|to complete|does it take|is) (accounting|business)/i,
            /duration of (accounting|business)/i,
            /how long (is|does) (accounting|business) (take|last)/i,
            /years (needed|required) for (accounting|business)/i
        ],
        response: "Business/Accounting Duration:\n• B.Sc Accounting: 4 years\n• B.Sc Business Administration: 4 years\n• B.Sc Banking & Finance: 4 years\n• Direct Entry: 3 years\n\nProgram Structure:\n• Year 1-2: Foundation (Economics, Business Math, Intro courses)\n• Year 3-4: Specialized courses and electives\n• Industrial training (6 months) usually in Year 3 long vacation\n• Final Year Project required\n\nFor Accounting graduates:\n• ICAN/ACCA professional exams (additional 2-3 years)"
    },

    // Arts/Humanities Duration
    artsDuration: {
        patterns: [
            /how (many|long) years (for|to complete|does it take|is) (english|history|philosophy|arts)/i,
            /duration of (english|history|philosophy|arts)/i,
            /how long (is|does) (english|history|arts) (take|last)/i,
            /years (needed|required) for (english|history|arts)/i
        ],
        response: "Arts/Humanities Duration:\n• B.A English: 4 years\n• B.A History: 4 years\n• B.A Philosophy: 4 years\n• B.A Theatre Arts: 4 years\n• B.A Languages: 4 years\n• Direct Entry: 3 years\n\nProgram Structure:\n• Year 1-2: Foundation and core courses\n• Year 3-4: Advanced studies and specialization\n• Final Year Project/Dissertation required\n\nAll Arts programs: 4 years full-time"
    },

    // Social Sciences Duration
    socialScienceDuration: {
        patterns: [
            /how (many|long) years (for|to complete|does it take|is) (economics|psychology|sociology|political science|mass communication)/i,
            /duration of (economics|psychology|sociology)/i,
            /how long (is|does) (economics|psychology|sociology) (take|last)/i,
            /years (needed|required) for (economics|psychology)/i
        ],
        response: "Social Sciences Duration:\n• B.Sc Economics: 4 years\n• B.Sc Psychology: 4 years\n• B.Sc Sociology: 4 years\n• B.Sc Political Science: 4 years\n• B.Sc Mass Communication: 4 years\n• Direct Entry: 3 years\n\nProgram Structure:\n• Year 1-2: Foundation courses and methodology\n• Year 3-4: Advanced studies and research\n• SIWES/Industrial Training (6 months) for some programs\n• Final Year Project/Thesis required\n\nAll Social Science programs: 4 years full-time"
    },

    // Science Courses Duration
    scienceDuration: {
        patterns: [
            /how (many|long) years (for|to complete|does it take|is) (physics|chemistry|biology|biochemistry)/i,
            /duration of (physics|chemistry|biology)/i,
            /how long (is|does) (physics|chemistry|biology) (take|last)/i,
            /years (needed|required) for (physics|chemistry|biology)/i
        ],
        response: "Science Programs Duration:\n• B.Sc Physics: 4 years\n• B.Sc Chemistry: 4 years\n• B.Sc Biology: 4 years\n• B.Sc Biochemistry: 4 years\n• B.Sc Microbiology: 4 years\n• Direct Entry: 3 years\n\nProgram Structure:\n• Year 1-2: Foundation sciences and lab work\n• Year 3-4: Advanced courses and specialization\n• Laboratory practicals throughout all years\n• Final Year Project/Research required\n• SIWES/Industrial Training (6 months)\n\nAll Science programs: 4 years full-time"
    },

    // Postgraduate Duration
    postgraduateDuration: {
        patterns: [
            /how (many|long) years (for|to complete|does it take|is) (masters|phd|postgraduate)/i,
            /duration of (masters|phd|postgraduate)/i,
            /how long (is|does) (masters|phd) (take|last)/i,
            /years (needed|required) for (masters|phd)/i,
            /(msc|ma|phd) duration/i
        ],
        response: "Postgraduate Programs Duration:\n\n📚 Masters Programs:\n• M.Sc/M.A (Full-time): 18-24 months (2 years)\n• M.Sc/M.A (Part-time): 3 years\n• MBA: 18-24 months\n• M.Ed: 18-24 months\n\nStructure:\n• Coursework: 1 year\n• Thesis/Dissertation: 6-12 months\n\n🎓 PhD Programs:\n• PhD (Full-time): 3-5 years\n• PhD (Part-time): 5-7 years\n\nStructure:\n• Coursework: 1 year\n• Comprehensive Exams: 6 months\n• Research & Dissertation: 2-4 years\n• Defense and submission\n\nNote: Duration depends on research progress and thesis completion"
    },

    // RULE 26: General Course Duration (FALLBACK)
    courseDuration: {
        patterns: [
            /how (many|long) years (for|to complete|does it take)/i,
            /duration of (the )?course/i,
            /how long (is|does) (the )?(course|program) (take|last)/i,
            /years (needed|required) for course/i,
            /(course|program) length/i,
            /how many years/i
        ],
        response: "General Course Duration at DELSU:\n\n🎓 Undergraduate Programs:\n• Most courses (B.Sc, B.A, B.Ed): 4 years\n• Medicine (MBBS): 6 years\n• Law (LLB): 5 years\n• Engineering (B.Eng): 5 years\n• Pharmacy (B.Pharm): 5 years\n• Nursing (B.NSc): 5 years\n\n📚 Postgraduate Programs:\n• Masters (M.Sc, M.A, MBA): 2 years\n• PhD: 3-5 years\n\n⚡ Direct Entry:\n• Reduces duration by 1 year for most programs\n\nFor specific course duration, ask: 'How long is [course name]?'"
    },

    // RULE 27: Courses Under Various Faculties
    facultyCourses: {
        patterns: [
            /what courses (are )?(in|under) (the )?(faculty|department)/i,
            /(list|tell me|show me) courses in (the )?faculty/i,
            /faculties and (their )?courses/i,
            /courses (offered|available) in (the )?faculty/i,
            /what (can|courses) (i study|are offered) in (the )?faculty/i,
            /courses (in|under|for|at) (the )?(faculty|department) of/i,
            /(faculty|department) of .* courses/i,
            /what .* in faculty/i,
            /list of faculties/i
        ],
        response: "Courses by Faculty:\n\n📚 Faculty of Science:\n• Mathematics, Physics, Chemistry, Biology, Statistics\n\n🏛️ Faculty of Arts:\n• English, History, Philosophy, Languages, Theatre Arts\n\n💼 Faculty of Social Sciences:\n• Economics, Political Science, Sociology, Psychology, Mass Communication\n\n⚖️ Faculty of Law:\n• Common Law, Civil Law, International Law\n\n🏥 Faculty of Medicine:\n• Medicine & Surgery, Nursing, Anatomy, Physiology\n\n🔧 Faculty of Engineering:\n• Civil, Mechanical, Electrical, Chemical Engineering\n\n📊 Faculty of Management Sciences:\n• Accounting, Business Administration, Banking & Finance\n\n💻 Faculty of Computing:\n• Computer Science, Cybersecurity, Data Science, AI, Software Engineering"
    },

    // RULE 28: Current Vice Chancellor
    viceChancellor: {
        patterns: [
            /who (is|'s) the (current )?vice chancellor/i,
            /(current )?vice chancellor (of|at) delsu/i,
            /(tell me about|name of) (the )?vice chancellor/i,
            /vc of delsu/i,
            /delsu vc/i
        ],
        response: "The current Vice Chancellor of Delta State University (DELSU) is Prof. Samuel Ogheneovo Asagba."
    }
};

// -------------------- GREETING RESPONSES --------------------

const greetings = {
    patterns: [
        /^(hi|hello|hey|greetings|good (morning|afternoon|evening))$/i,
        /^(what's up|sup|yo)$/i
    ],
    responses: [
        "Hello! How can I help you today?",
        "Hi there! What would you like to know?",
        "Hey! Ask me anything about courses, library, or school info!"
    ]
};

// -------------------- FAREWELL RESPONSES --------------------

const farewells = {
    patterns: [
        /^(bye|goodbye|see you|thanks|thank you|that's all)$/i,
        /^(ok|okay) (bye|thanks)$/i
    ],
    responses: [
        "Goodbye! Feel free to come back if you have more questions!",
        "Happy to help! Have a great day!",
        "Take care! Good luck with your studies!"
    ]
};

// -------------------- KEYWORD FALLBACK --------------------
// CRITICAL: Ordered from MOST SPECIFIC to MOST GENERAL
// This prevents false matches - specific phrases checked first

const keywords = {
    // MOST SPECIFIC PHRASES (4+ words)
    'how to apply to delsu': 'applicationProcess',
    'apply for scholarship': 'scholarshipApplication',
    'application start date': 'applicationTimeline',
    'application deadline': 'applicationTimeline',
    'how long is computer science': 'csDuration',
    'how long is engineering': 'engineeringDuration',
    'how long is medicine': 'medicineDuration',
    'how long is law': 'lawDuration',
    
    // SPECIFIC PHRASES (3 words)
    'computer science admission': 'csAdmission',
    'engineering admission': 'engineeringAdmission',
    'medicine admission': 'medicineAdmission',
    'law admission': 'lawAdmission',
    'mathematics admission': 'mathAdmission',
    'science faculty admission': 'scienceFacultyAdmission',
    'arts faculty admission': 'artsFacultyAdmission',
    'management admission': 'managementAdmission',
    'social science admission': 'socialScienceAdmission',
    'application process': 'applicationProcess',
    'vice chancellor': 'viceChancellor',
    'computer science duration': 'csDuration',
    'engineering duration': 'engineeringDuration',
    'medicine duration': 'medicineDuration',
    'law duration': 'lawDuration',
    'pharmacy duration': 'pharmacyDuration',
    'nursing duration': 'nursingDuration',
    'postgraduate duration': 'postgraduateDuration',
    'masters duration': 'postgraduateDuration',
    'phd duration': 'postgraduateDuration',
    
    // MEDIUM SPECIFIC (2 words)
    'course duration': 'courseDuration',
    'how long': 'courseDuration',
    'library hours': 'libraryHours',
    'library card': 'libraryCard',
    'school fees': 'courseFees',
    'admission deadline': 'applicationTimeline',
    
    // GENERAL KEYWORDS (1 word) - CHECKED LAST
    'scholarship': 'scholarship',
    'library': 'libraryHours',
    'contact': 'contact',
    'calendar': 'calendar',
    'faculty': 'facultyCourses',
    'admission': 'admission',
    'course': 'courses'
};

// -------------------- PATTERN MATCHING FUNCTION --------------------

function matchPattern(userInput) {
    const input = userInput.trim().toLowerCase();

    // STEP 1: Check greetings
    for (let pattern of greetings.patterns) {
        if (pattern.test(input)) {
            const response = greetings.responses[Math.floor(Math.random() * greetings.responses.length)];
            return { response, rule: 'greeting', confidence: 'high' };
        }
    }

    // STEP 2: Check farewells
    for (let pattern of farewells.patterns) {
        if (pattern.test(input)) {
            const response = farewells.responses[Math.floor(Math.random() * farewells.responses.length)];
            return { response, rule: 'farewell', confidence: 'high' };
        }
    }

    // STEP 3: Check knowledge base patterns (HIGHEST PRIORITY)
    for (let [key, value] of Object.entries(knowledgeBase)) {
        for (let pattern of value.patterns) {
            if (pattern.test(input)) {
                return { response: value.response, rule: key, confidence: 'high' };
            }
        }
    }

    // STEP 4: Keyword fallback (sorted by length - longest first)
    const sortedKeywords = Object.entries(keywords).sort((a, b) => b[0].length - a[0].length);
    
    for (let [keyword, rule] of sortedKeywords) {
        if (input.includes(keyword)) {
            if (knowledgeBase[rule]) {
                return { response: knowledgeBase[rule].response, rule: rule, confidence: 'medium' };
            }
        }
    }

    // STEP 5: Default fallback
    return {
        response: "I'm sorry, I don't understand that question. I can help you with:\n• Course information & duration\n• Admission requirements (by department)\n• Application process & timeline\n• Library rules and hours\n• Scholarship information\n• Contact information\n• Faculty courses\n• Academic calendar\n\nTry asking: 'How do I apply to DELSU?' or 'What are the requirements for Computer Science?'",
        rule: 'fallback',
        confidence: 'none'
    };
}

// -------------------- MESSAGE MANAGEMENT --------------------

function addMessage(text, sender, rule = null, confidence = null) {
    const message = { text, sender, rule, confidence };
    messages.push(message);
    renderMessages();
}

/**
 * Convert URLs in text to clickable links
 * @param {string} text - Text that may contain URLs
 * @returns {string} HTML string with clickable links
 */
function linkifyText(text) {
    // Regular expression to detect URLs (both http and www formats)
    const urlPattern = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/g;
    
    // Replace URLs with clickable anchor tags
    return text.replace(urlPattern, function(url) {
        // Add https:// if the URL starts with www
        const href = url.startsWith('www.') ? 'https://' + url : url;
        return `<a href="${href}" target="_blank" rel="noopener noreferrer" style="color: #0066cc; text-decoration: underline;">${url}</a>`;
    });
}

function renderMessages() {
    const container = document.getElementById('chatMessages');
    container.innerHTML = '';

    messages.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${msg.sender}`;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        // Convert message text to preserve line breaks and make URLs clickable
        if (msg.sender === 'bot') {
            // For bot messages, convert URLs to links and preserve formatting
            const textWithLinks = linkifyText(msg.text);
            // Replace line breaks with <br> tags
            const formattedText = textWithLinks.replace(/\n/g, '<br>');
            contentDiv.innerHTML = formattedText;
        } else {
            // For user messages, just show as text
            contentDiv.textContent = msg.text;
        }

        if (debugMode && msg.sender === 'bot' && msg.rule) {
            const debugDiv = document.createElement('div');
            debugDiv.className = 'debug-info';
            debugDiv.textContent = `Rule: ${msg.rule} | Confidence: ${msg.confidence}`;
            contentDiv.appendChild(debugDiv);
        }

        messageDiv.appendChild(contentDiv);
        container.appendChild(messageDiv);
    });

    container.scrollTop = container.scrollHeight;
}

// -------------------- USER INTERACTION FUNCTIONS --------------------

function sendMessage() {
    const input = document.getElementById('userInput');
    const text = input.value.trim();

    if (!text) return;

    addMessage(text, 'user');
    input.value = '';

    const result = matchPattern(text);
    
    setTimeout(() => {
        addMessage(result.response, 'bot', result.rule, result.confidence);
    }, 300);
}

function sendExample(text) {
    document.getElementById('userInput').value = text;
    sendMessage();
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function toggleDebug() {
    debugMode = !debugMode;
    renderMessages();
}

function resetChat() {
    messages = [];
    const welcomeMessage = "Welcome to DELSU FAQ Chatbot! 🎓\n\n" +
        "I can help you with:\n" +
        "✓ Admission requirements\n" +
        "✓ Application process & timeline\n" +
        "✓ Course information & duration\n" +
        "✓ Scholarship opportunities\n" +
        "✓ Library services\n" +
        "✓ Contact information\n" +
        "✓ School fees & costs\n" +
        "✓ Academic calendar\n\n" +
        "What would you like to know?";
    
    addMessage(welcomeMessage, 'bot', 'greeting', 'high');
}

// -------------------- INITIALIZATION --------------------

resetChat();