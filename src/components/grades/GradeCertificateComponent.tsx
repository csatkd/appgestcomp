import { GradeCertificate } from '../../lib/grades/types';

interface GradeCertificateComponentProps {
  certificate: GradeCertificate;
}

export default function GradeCertificateComponent({ certificate }: GradeCertificateComponentProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-bone text-night p-8 max-w-4xl mx-auto">
      {/* En-tête du certificat */}
      <div className="border-b-4 border-double border-gold pb-6 mb-6 text-center">
        <div className="text-6xl mb-4">🥋</div>
        <h1 className="text-4xl font-bold uppercase tracking-wider mb-2">
          Certificat de Grade
        </h1>
        <p className="text-xl text-dune">
          Fédération de Taekwondo
        </p>
      </div>

      {/* Contenu principal */}
      <div className="text-center mb-8">
        <p className="text-lg mb-4">
          Ce certificat est décerné à
        </p>
        <h2 className="text-5xl font-bold mb-4 border-b-2 border-gold pb-4 inline-block">
          {certificate.athleteName}
        </h2>
        <p className="text-lg mb-2">
          Ayant réussi avec succès l'examen de passage de grade
        </p>
        <p className="text-3xl font-bold text-gold mb-2">
          {certificate.belt.name}
        </p>
        <p className="text-lg">
          Ceinture {certificate.belt.color}
        </p>
      </div>

      {/* Détails de l'examen */}
      <div className="grid grid-cols-2 gap-6 mb-8 p-6 bg-bark/50 rounded-lg">
        <div>
          <p className="text-sm text-dune mb-1">Date de l'examen</p>
          <p className="font-semibold">
            {new Date(certificate.examDate).toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
        <div>
          <p className="text-sm text-dune mb-1">Score final</p>
          <p className="font-semibold text-2xl text-gold">
            {certificate.finalScore.toFixed(2)} / 10
          </p>
        </div>
        <div>
          <p className="text-sm text-dune mb-1">Date de délivrance</p>
          <p className="font-semibold">
            {new Date(certificate.issueDate).toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
        <div>
          <p className="text-sm text-dune mb-1">Numéro de certificat</p>
          <p className="font-semibold font-mono text-sm">
            {certificate.certificateNumber}
          </p>
        </div>
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {certificate.signedBy.map((signatory, index) => (
          <div key={index} className="text-center">
            <div className="border-b border-night mb-2 h-16"></div>
            <p className="text-sm font-semibold">{signatory}</p>
            <p className="text-xs text-dune">Examinateur</p>
          </div>
        ))}
      </div>

      {/* Code de vérification */}
      <div className="border-t-2 border-gold pt-6 text-center">
        <p className="text-sm text-dune mb-2">Code de vérification</p>
        <p className="font-mono text-lg font-bold">
          {certificate.verificationCode}
        </p>
        <p className="text-xs text-dune mt-2">
          Vérifiez l'authenticité de ce certificat sur www.dojang.ci/verify
        </p>
      </div>

      {/* Pied de page */}
      <div className="mt-8 text-center text-xs text-dune">
        <p>
          Ce certificat atteste que le titulaire a démontré les compétences requises
          pour obtenir le grade de {certificate.belt.name} conformément aux standards
          de la Fédération de Taekwondo.
        </p>
      </div>

      {/* Bouton d'impression */}
      <div className="mt-8 text-center print:hidden">
        <button
          onClick={handlePrint}
          className="px-6 py-3 bg-night text-bone font-bold uppercase hover:bg-night/80"
        >
          Imprimer le certificat
        </button>
      </div>

      {/* Styles pour l'impression */}
      <style>{`
        @media print {
          body {
            background: white !important;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
