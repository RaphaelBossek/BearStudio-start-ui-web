import { db } from '../../src/server/db';
import {
  AccountStatus,
  BillingModality,
  ConsultationType,
  QualificationLevel,
  SkillType,
} from '../../src/server/db/generated/enums';

export async function createMCPData() {
  console.log('🌱 Seeding MCP data...');

  // 1. Departments
  const departments = [
    'Allgemeinmedizin',
    'Psychiatrie',
    'Dermatologie',
    'Substitution',
    'Psychotherapie',
    'Physiotherapie',
  ];

  for (const name of departments) {
    await db.department.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log('✅ Departments created');

  // 2. Skills
  const skills = [
    {
      name: 'Suchtmedizin',
      type: SkillType.SPECIALTY,
      description: 'Expertise in addiction medicine',
    },
    { name: 'English', type: SkillType.LANGUAGE, description: 'Fluent in English' },
    { name: 'German', type: SkillType.LANGUAGE, description: 'Fluent in German' },
    {
      name: 'Group Therapy',
      type: SkillType.ADDITIONAL_TRAINING,
      description: 'Certified group therapist',
    },
  ];

  for (const skill of skills) {
    await db.skill.upsert({
      where: { name: skill.name },
      update: {},
      create: skill,
    });
  }
  console.log('✅ Skills created');

  // 3. Exclusion Criteria
  const exclusions = [
    { name: 'No Night Shifts', description: 'Expert cannot work during night', weight: 10 },
    {
      name: 'Remote Only',
      description: 'Expert only available for remote consultations',
      weight: 5,
    },
  ];

  for (const exclusion of exclusions) {
    await db.exclusionCriterion.upsert({
      where: { name: exclusion.name },
      update: {},
      create: exclusion,
    });
  }
  console.log('✅ Exclusion criteria created');

  // 4. Locations
  const locations = [
    { name: 'Main Clinic', address: '123 Health St' },
    { name: 'Remote Hub', address: 'Virtual' },
  ];

  for (const loc of locations) {
    await db.location.upsert({
      where: { name: loc.name },
      update: {},
      create: loc,
    });
  }
  console.log('✅ Locations created');

  // 5. Services
  const dept = await db.department.findFirst({ where: { name: 'Allgemeinmedizin' } });
  if (dept) {
    const services = [
      {
        internalName: 'Bereitschaftsdienst Allgemein',
        expertName: 'Bereitschaft',
        invoiceName: 'Ärztlicher Bereitschaftsdienst',
        shortName: 'BD',
        color: '#ff0000',
        billingModality: BillingModality.PATIENTS,
        departmentId: dept.id,
        consultationTypes: [ConsultationType.NORMAL, ConsultationType.EXTERN],
        defaultConsultationType: ConsultationType.NORMAL,
      },
      {
        internalName: 'Sprechstunde Allgemein',
        expertName: 'Sprechstunde',
        invoiceName: 'Ärztliche Sprechstunde',
        shortName: 'SS',
        color: '#00ff00',
        billingModality: BillingModality.TIME,
        departmentId: dept.id,
        consultationTypes: [ConsultationType.NORMAL],
        defaultConsultationType: ConsultationType.NORMAL,
      },
    ];

    for (const service of services) {
      await db.service.create({
        data: service,
      });
    }
  }
  console.log('✅ Services created');

  // 6. Expert Profile for an existing user (if any)
  const user = await db.user.findFirst();
  if (user) {
    await db.expertProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        academicTitle: 'Dr. med.',
        salutation: 'Herr',
        status: AccountStatus.ACTIVE,
        qualificationLevel: QualificationLevel.PROFESSIONAL,
        focusReadiness: 'high',
        focusConsultation: 'middle',
        focusTherapy: 'low',
      },
    });
    console.log(`✅ Expert profile created for user ${user.email}`);
  }

  console.log('🏁 MCP data seeding completed');
}
