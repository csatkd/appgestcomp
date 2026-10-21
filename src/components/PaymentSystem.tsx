import { useState } from 'react';
import { useApp } from '../lib/store';
import { PageHead, Modal, useToast } from './ui';
import PageBackground from './PageBackground';
import { PAGE_BACKGROUNDS } from '../config/backgrounds';
import { IconCreditCard, IconTicket, IconCalendar } from './Icons';

interface PricingTier {
  id: string;
  name: string;
  price: number;
  startDate: string;
  endDate: string;
  description: string;
}

interface Coupon {
  id: string;
  code: string;
  discount: number; // percentage
  maxUses: number;
  usedCount: number;
  validUntil: string;
  active: boolean;
}

interface Registration {
  id: string;
  athleteId: string;
  competitionId: string;
  pricingTierId: string;
  couponId?: string;
  amount: number;
  status: 'pending' | 'paid' | 'cancelled';
  registeredAt: string;
  paidAt?: string;
}

export default function PaymentSystem() {
  const { state } = useApp();
  const toast = useToast();
  
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([
    {
      id: 'early',
      name: 'Early Bird',
      price: 30000,
      startDate: '2026-01-01',
      endDate: '2026-02-28',
      description: 'Inscription anticipée (-25%)'
    },
    {
      id: 'regular',
      name: 'Tarif Normal',
      price: 40000,
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      description: 'Tarif standard'
    },
    {
      id: 'late',
      name: 'Late Registration',
      price: 50000,
      startDate: '2026-04-01',
      endDate: '2026-04-10',
      description: 'Inscription tardive (+25%)'
    }
  ]);

  const [coupons, setCoupons] = useState<Coupon[]>([
    {
      id: 'coup1',
      code: 'FITKD2026',
      discount: 10,
      maxUses: 100,
      usedCount: 23,
      validUntil: '2026-04-30',
      active: true
    },
    {
      id: 'coup2',
      code: 'CLUB15',
      discount: 15,
      maxUses: 50,
      usedCount: 8,
      validUntil: '2026-03-31',
      active: true
    }
  ]);

  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getCurrentPricingTier = () => {
    const now = new Date();
    return pricingTiers.find(tier => {
      const start = new Date(tier.startDate);
      const end = new Date(tier.endDate);
      return now >= start && now <= end;
    }) || pricingTiers[0];
  };

  const calculateFinalPrice = (basePrice: number, couponCode?: string) => {
    if (!couponCode) return basePrice;
    
    const coupon = coupons.find(c => c.code === couponCode && c.active);
    if (!coupon) return basePrice;
    
    if (coupon.usedCount >= coupon.maxUses) {
      toast('Coupon épuisé', 'error');
      return basePrice;
    }
    
    const discount = (basePrice * coupon.discount) / 100;
    return basePrice - discount;
  };

  const applyCoupon = (couponCode: string, registrationId: string) => {
    const coupon = coupons.find(c => c.code === couponCode);
    if (!coupon) {
      toast('Coupon invalide', 'error');
      return;
    }
    
    setCoupons(coupons.map(c => 
      c.id === coupon.id ? { ...c, usedCount: c.usedCount + 1 } : c
    ));
    
    setRegistrations(registrations.map(r =>
      r.id === registrationId ? { ...r, couponId: coupon.id } : r
    ));
    
    toast('Coupon appliqué avec succès', 'success');
  };

  const processPayment = (registrationId: string) => {
    setRegistrations(registrations.map(r =>
      r.id === registrationId ? { 
        ...r, 
        status: 'paid',
        paidAt: new Date().toISOString()
      } : r
    ));
    toast('Paiement confirmé', 'success');
  };

  const currentTier = getCurrentPricingTier();
  const totalRevenue = registrations
    .filter(r => r.status === 'paid')
    .reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="fade-up mx-auto max-w-7xl">
      <PageBackground imageUrl={PAGE_BACKGROUNDS.dashboard} opacity={0.08} blur={3} />
      <PageHead
        title="Système de Paiement & Inscriptions"
        subtitle="Gestion des tarifs, coupons et paiements"
      />

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="panel p-6">
          <IconCreditCard className="w-8 h-8 text-gold mb-3" />
          <p className="font-display text-3xl text-bone mb-1">
            {formatAmount(totalRevenue)}
          </p>
          <p className="text-sm text-dune">Revenus totaux</p>
        </div>
        <div className="panel p-6">
          <IconTicket className="w-8 h-8 text-forest mb-3" />
          <p className="font-display text-3xl text-bone mb-1">
            {registrations.length}
          </p>
          <p className="text-sm text-dune">Inscriptions</p>
        </div>
        <div className="panel p-6">
          <IconCalendar className="w-8 h-8 text-chong mb-3" />
          <p className="font-display text-3xl text-bone mb-1">
            {currentTier.name}
          </p>
          <p className="text-sm text-dune">Tarif actuel</p>
        </div>
        <div className="panel p-6">
          <IconTicket className="w-8 h-8 text-flame mb-3" />
          <p className="font-display text-3xl text-bone mb-1">
            {coupons.filter(c => c.active).length}
          </p>
          <p className="text-sm text-dune">Coupons actifs</p>
        </div>
      </div>

      {/* Tarifs */}
      <div className="panel p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-2xl text-bone">Grille Tarifaire</h3>
          <button
            onClick={() => setShowPricingModal(true)}
            className="btn btn-primary"
          >
            Gérer les tarifs
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pricingTiers.map((tier) => {
            const isCurrent = tier.id === currentTier.id;
            return (
              <div
                key={tier.id}
                className={`panel p-6 ${
                  isCurrent ? 'border-gold border-2' : ''
                }`}
              >
                {isCurrent && (
                  <div className="bg-gold text-night text-xs font-bold px-3 py-1 rounded-full inline-block mb-3">
                    ACTUEL
                  </div>
                )}
                <h4 className="font-display text-xl text-bone mb-2">{tier.name}</h4>
                <p className="font-display text-4xl text-gold mb-2">
                  {formatAmount(tier.price)}
                </p>
                <p className="text-sm text-dune mb-4">{tier.description}</p>
                <div className="text-xs text-dune space-y-1">
                  <p>Du {new Date(tier.startDate).toLocaleDateString('fr-FR')}</p>
                  <p>Au {new Date(tier.endDate).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Coupons */}
      <div className="panel p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-2xl text-bone">Coupons de Réduction</h3>
          <button
            onClick={() => setShowCouponModal(true)}
            className="btn btn-primary"
          >
            Créer un coupon
          </button>
        </div>
        
        <div className="space-y-3">
          {coupons.map((coupon) => (
            <div key={coupon.id} className="panel p-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <IconTicket className="w-5 h-5 text-gold" />
                  <span className="font-mono font-bold text-bone text-lg">
                    {coupon.code}
                  </span>
                  <span className={`badge ${coupon.active ? 'text-forest' : 'text-dune'}`}>
                    {coupon.active ? 'Actif' : 'Inactif'}
                  </span>
                </div>
                <div className="text-sm text-dune space-y-1">
                  <p>Réduction : {coupon.discount}%</p>
                  <p>Utilisations : {coupon.usedCount}/{coupon.maxUses}</p>
                  <p>Valide jusqu'au {new Date(coupon.validUntil).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setCoupons(coupons.map(c =>
                      c.id === coupon.id ? { ...c, active: !c.active } : c
                    ));
                    toast(`Coupon ${coupon.active ? 'désactivé' : 'activé'}`, 'info');
                  }}
                  className="btn btn-ghost btn-sm"
                >
                  {coupon.active ? 'Désactiver' : 'Activer'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inscriptions */}
      <div className="panel p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-2xl text-bone">Inscriptions</h3>
          <button
            onClick={() => setShowRegistrationModal(true)}
            className="btn btn-primary"
          >
            Nouvelle inscription
          </button>
        </div>
        
        {registrations.length === 0 ? (
          <div className="text-center py-12">
            <IconCreditCard className="w-16 h-16 text-dune/30 mx-auto mb-4" />
            <p className="text-dune">Aucune inscription pour le moment</p>
          </div>
        ) : (
          <div className="space-y-3">
            {registrations.map((reg) => {
              const athlete = state.athletes.find(a => a.id === reg.athleteId);
              const coupon = coupons.find(c => c.id === reg.couponId);
              
              return (
                <div key={reg.id} className="panel p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold text-bone">
                        {athlete?.firstName} {athlete?.lastName}
                      </p>
                      <p className="text-sm text-dune">{athlete?.club}</p>
                    </div>
                    <span className={`badge ${
                      reg.status === 'paid' ? 'text-forest' :
                      reg.status === 'pending' ? 'text-gold' :
                      'text-flame'
                    }`}>
                      {reg.status === 'paid' ? 'Payé' :
                       reg.status === 'pending' ? 'En attente' :
                       'Annulé'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-dune">Montant :</span>
                      <span className="ml-2 font-semibold text-bone">
                        {formatAmount(reg.amount)}
                      </span>
                    </div>
                    <div>
                      <span className="text-dune">Date :</span>
                      <span className="ml-2 text-bone">
                        {new Date(reg.registeredAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    {coupon && (
                      <div className="col-span-2">
                        <span className="text-dune">Coupon :</span>
                        <span className="ml-2 font-mono text-gold">
                          {coupon.code} (-{coupon.discount}%)
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {reg.status === 'pending' && (
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => processPayment(reg.id)}
                        className="btn btn-primary flex-1"
                      >
                        Confirmer le paiement
                      </button>
                      <button
                        onClick={() => {
                          setRegistrations(registrations.filter(r => r.id !== reg.id));
                          toast('Inscription annulée', 'info');
                        }}
                        className="btn btn-danger"
                      >
                        Annuler
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      {showPricingModal && (
        <Modal
          open={showPricingModal}
          onClose={() => setShowPricingModal(false)}
          title="Gérer les tarifs"
        >
          <div className="space-y-4">
            <p className="text-dune">
              Fonctionnalité de gestion des tarifs en cours de développement
            </p>
            <button
              onClick={() => setShowPricingModal(false)}
              className="btn btn-primary w-full"
            >
              Fermer
            </button>
          </div>
        </Modal>
      )}

      {showCouponModal && (
        <Modal
          open={showCouponModal}
          onClose={() => setShowCouponModal(false)}
          title="Créer un coupon"
        >
          <div className="space-y-4">
            <p className="text-dune">
              Fonctionnalité de création de coupons en cours de développement
            </p>
            <button
              onClick={() => setShowCouponModal(false)}
              className="btn btn-primary w-full"
            >
              Fermer
            </button>
          </div>
        </Modal>
      )}

      {showRegistrationModal && (
        <Modal
          open={showRegistrationModal}
          onClose={() => setShowRegistrationModal(false)}
          title="Nouvelle inscription"
        >
          <div className="space-y-4">
            <p className="text-dune">
              Fonctionnalité d'inscription en cours de développement
            </p>
            <button
              onClick={() => setShowRegistrationModal(false)}
              className="btn btn-primary w-full"
            >
              Fermer
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
