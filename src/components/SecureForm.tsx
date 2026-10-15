import React, { useState } from 'react';
import { sanitizeString, validateEmail, validatePhone, validateName, validateYear, validateWeight } from '../utils/security';
import { useToast } from './ui';

interface SecureFormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'tel' | 'number' | 'date';
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  validation?: (value: string) => { valid: boolean; error?: string };
}

export function SecureFormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  required = false,
  placeholder,
  validation,
}: SecureFormFieldProps) {
  const [error, setError] = useState<string>('');
  const [touched, setTouched] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    
    // Nettoyer la valeur
    const sanitized = sanitizeString(rawValue);
    onChange(sanitized);
    
    // Valider si touché
    if (touched && validation) {
      const result = validation(sanitized);
      setError(result.valid ? '' : result.error || 'Champ invalide');
    }
  };

  const handleBlur = () => {
    setTouched(true);
    if (validation) {
      const result = validation(value);
      setError(result.valid ? '' : result.error || 'Champ invalide');
    }
  };

  return (
    <div>
      <label className="label">
        {label}
        {required && <span className="text-flame ml-1">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        required={required}
        className={`input ${error ? 'border-flame' : ''}`}
      />
      {error && touched && (
        <p className="mt-1 text-xs text-flame">{error}</p>
      )}
    </div>
  );
}

interface SecureFormProps {
  onSubmit: (data: Record<string, string>) => void;
  children: React.ReactNode;
  className?: string;
}

export function SecureForm({ onSubmit, children, className }: SecureFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      const data: Record<string, string> = {};
      
      // Collecter et nettoyer toutes les données
      formData.forEach((value, key) => {
        if (typeof value === 'string') {
          data[key] = sanitizeString(value);
        }
      });
      
      // Soumettre les données
      onSubmit(data);
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      {children}
    </form>
  );
}

// ============================================
// HOOKS DE VALIDATION
// ============================================

/**
 * Hook pour valider un email
 */
export function useEmailValidation() {
  return (email: string) => ({
    valid: validateEmail(email),
    error: validateEmail(email) ? undefined : 'Email invalide',
  });
}

/**
 * Hook pour valider un téléphone
 */
export function usePhoneValidation() {
  return (phone: string) => ({
    valid: validatePhone(phone),
    error: validatePhone(phone) ? undefined : 'Téléphone invalide',
  });
}

/**
 * Hook pour valider un nom
 */
export function useNameValidation() {
  return (name: string) => validateName(name);
}

/**
 * Hook pour valider une année
 */
export function useYearValidation() {
  return (year: string | number) => validateYear(year);
}

/**
 * Hook pour valider un poids
 */
export function useWeightValidation() {
  return (weight: string | number) => validateWeight(weight);
}

// ============================================
// COMPOSANTS DE FORMULAIRES SÉCURISÉS
// ============================================

interface SecureAthleteFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
}

export function SecureAthleteForm({ onSubmit, initialData }: SecureAthleteFormProps) {
  const toast = useToast();
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    gender: initialData?.gender || 'M',
    birthYear: initialData?.birthYear?.toString() || '',
    club: initialData?.club || '',
    license: initialData?.license || '',
  });

  const validateForm = (): boolean => {
    const errors: string[] = [];
    
    const firstNameValidation = validateName(formData.firstName);
    if (!firstNameValidation.valid) errors.push(firstNameValidation.error || 'Prénom invalide');
    
    const lastNameValidation = validateName(formData.lastName);
    if (!lastNameValidation.valid) errors.push(lastNameValidation.error || 'Nom invalide');
    
    const yearValidation = validateYear(formData.birthYear);
    if (!yearValidation.valid) errors.push(yearValidation.error || 'Année invalide');
    
    if (!formData.club) errors.push('Club requis');
    
    if (errors.length > 0) {
      errors.forEach(error => toast(error, 'error'));
      return false;
    }
    
    return true;
  };

  const handleSubmit = (data: Record<string, string>) => {
    if (!validateForm()) return;
    
    onSubmit({
      ...formData,
      birthYear: parseInt(formData.birthYear, 10),
    });
  };

  return (
    <SecureForm onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <SecureFormField
          label="Prénom"
          name="firstName"
          value={formData.firstName}
          onChange={(value) => setFormData({ ...formData, firstName: value })}
          required
          validation={(value) => validateName(value)}
        />
        
        <SecureFormField
          label="Nom"
          name="lastName"
          value={formData.lastName}
          onChange={(value) => setFormData({ ...formData, lastName: value })}
          required
          validation={(value) => validateName(value)}
        />
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 mt-4">
        <div>
          <label className="label">Genre</label>
          <select
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            className="input"
          >
            <option value="M">Homme</option>
            <option value="F">Femme</option>
          </select>
        </div>
        
        <SecureFormField
          label="Année de naissance"
          name="birthYear"
          type="number"
          value={formData.birthYear}
          onChange={(value) => setFormData({ ...formData, birthYear: value })}
          required
          validation={(value) => validateYear(value)}
        />
      </div>
      
      <div className="mt-4">
        <SecureFormField
          label="Club"
          name="club"
          value={formData.club}
          onChange={(value) => setFormData({ ...formData, club: value })}
          required
          placeholder="Ex: Taekwondo Club d'Abidjan"
        />
      </div>
      
      <div className="flex justify-end gap-3 mt-6">
        <button type="submit" className="btn btn-primary">
          {initialData ? 'Mettre à jour' : 'Ajouter'}
        </button>
      </div>
    </SecureForm>
  );
}

interface SecureSponsorFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
}

export function SecureSponsorForm({ onSubmit, initialData }: SecureSponsorFormProps) {
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    type: initialData?.type || 'partenaire',
    level: initialData?.level || 'bronze',
    contact: initialData?.contact || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
  });

  const validateForm = (): boolean => {
    const errors: string[] = [];
    
    if (!formData.name) errors.push('Nom requis');
    if (!formData.contact) errors.push('Contact requis');
    
    if (formData.email && !validateEmail(formData.email)) {
      errors.push('Email invalide');
    }
    
    if (formData.phone && !validatePhone(formData.phone)) {
      errors.push('Téléphone invalide');
    }
    
    if (errors.length > 0) {
      errors.forEach(error => toast(error, 'error'));
      return false;
    }
    
    return true;
  };

  const handleSubmit = (data: Record<string, string>) => {
    if (!validateForm()) return;
    
    onSubmit(formData);
  };

  return (
    <SecureForm onSubmit={handleSubmit}>
      <SecureFormField
        label="Nom du sponsor"
        name="name"
        value={formData.name}
        onChange={(value) => setFormData({ ...formData, name: value })}
        required
      />
      
      <div className="grid gap-4 sm:grid-cols-2 mt-4">
        <div>
          <label className="label">Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="input"
          >
            <option value="principal">Sponsor Principal</option>
            <option value="officiel">Sponsor Officiel</option>
            <option value="partenaire">Partenaire</option>
            <option value="media">Partenaire Média</option>
            <option value="technique">Partenaire Technique</option>
          </select>
        </div>
        
        <div>
          <label className="label">Niveau</label>
          <select
            value={formData.level}
            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
            className="input"
          >
            <option value="or">Or</option>
            <option value="argent">Argent</option>
            <option value="bronze">Bronze</option>
          </select>
        </div>
      </div>
      
      <div className="mt-4">
        <SecureFormField
          label="Personne de contact"
          name="contact"
          value={formData.contact}
          onChange={(value) => setFormData({ ...formData, contact: value })}
          required
        />
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 mt-4">
        <SecureFormField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={(value) => setFormData({ ...formData, email: value })}
          validation={(value) => ({
            valid: validateEmail(value),
            error: validateEmail(value) ? undefined : 'Email invalide',
          })}
        />
        
        <SecureFormField
          label="Téléphone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={(value) => setFormData({ ...formData, phone: value })}
          validation={(value) => ({
            valid: validatePhone(value),
            error: validatePhone(value) ? undefined : 'Téléphone invalide',
          })}
        />
      </div>
      
      <div className="flex justify-end gap-3 mt-6">
        <button type="submit" className="btn btn-primary">
          {initialData ? 'Mettre à jour' : 'Ajouter'}
        </button>
      </div>
    </SecureForm>
  );
}
