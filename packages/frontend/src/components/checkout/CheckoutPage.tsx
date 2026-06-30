'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { strapiUrl } from '@/lib/strapi';
import { COPY } from '@/constants/copy';
import { useCart, type CartItem } from '@/context/CartContext';
import { useOrderConfirmation } from '@/context/OrderConfirmationContext';
import { ApiError } from '@/lib/api';
import {
  isValidName,
  isValidAddress,
  isValidPhone,
  isValidCardNumber,
  isValidCvv,
  isValidExpiry,
  formatExpiryInput,
} from '@/lib/validation';
import { FloatingLabelInput } from './FloatingLabelInput';
import styles from './CheckoutPage.module.css';

function lineDescription(item: CartItem) {
  const parts: string[] = [];
  if (item.side) parts.push(item.side);
  if (item.changes.length) parts.push(item.changes.join(', '));
  return parts.join(' | ');
}

function LockIcon({ open }: { open: boolean }) {
  return (
    <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
      <rect
        x="1"
        y="7"
        width="12"
        height="8"
        rx="1.5"
        stroke="#ffffff"
        strokeWidth="1.3"
      />
      {open ? (
        <path
          d="M3.5 7V4.5a3.5 3.5 0 0 1 6.5-1.8"
          stroke="#ffffff"
          strokeWidth="1.3"
          fill="none"
        />
      ) : (
        <path
          d="M3.5 7V4.5a3.5 3.5 0 0 1 7 0V7"
          stroke="#ffffff"
          strokeWidth="1.3"
          fill="none"
        />
      )}
    </svg>
  );
}

export function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, comment, setComment, clearCart } = useCart();
  const { placeOrder } = useOrderConfirmation();

  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [cvv, setCvv] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const phoneError =
    phoneNumber.length > 0 && !isValidPhone(phoneNumber)
      ? COPY.checkout.invalidPhoneError
      : null;
  const cardNumberError =
    cardNumber.length > 0 && !isValidCardNumber(cardNumber)
      ? COPY.checkout.invalidCardNumberError
      : null;
  const cvvError =
    cvv.length > 0 && !isValidCvv(cvv) ? COPY.checkout.invalidCvvError : null;
  const expiryError =
    expiryDate.length > 0 && !isValidExpiry(expiryDate)
      ? COPY.checkout.invalidExpiryError
      : null;

  const isFormValid = useMemo(
    () =>
      isValidName(fullName) &&
      isValidAddress(address) &&
      isValidPhone(phoneNumber) &&
      isValidCardNumber(cardNumber) &&
      isValidName(nameOnCard) &&
      isValidCvv(cvv) &&
      isValidExpiry(expiryDate),
    [fullName, address, phoneNumber, cardNumber, nameOnCard, cvv, expiryDate],
  );

  const handleClose = () => router.back();

  const handleCompletePayment = async () => {
    if (!isFormValid || isSubmitting || items.length === 0) return;
    const restaurant = items[0].dish.restaurant;
    if (!restaurant) {
      setError(COPY.checkout.genericError);
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await placeOrder({
        restaurantId: restaurant.documentId,
        restaurantName: restaurant.name,
        items: items.map((item) => ({
          dishId: item.dish.documentId,
          dishName: item.dish.name,
          price: item.dish.price,
          quantity: item.quantity,
          side: item.side ?? undefined,
          changes: item.changes.length ? item.changes : undefined,
        })),
        comment: comment || undefined,
      });
      router.push('/');
      clearCart();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : COPY.checkout.genericError,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button
          type="button"
          className={styles.closeBtn}
          aria-label={COPY.checkout.closeAriaLabel}
          onClick={handleClose}
        >
          <Image src="/icons/x.png" alt="" width={20} height={20} />
        </button>
        <Image
          src="/icons/logoMobile.png"
          alt="Epicure"
          width={33}
          height={32}
          className={styles.logo}
        />
      </header>

      <header className={styles.desktopHeader}>
        <Link
          href="/"
          className={styles.desktopLogoGroup}
          aria-label="Epicure home"
        >
          <Image
            src="/icons/logoMobile.png"
            alt="Epicure"
            width={33}
            height={32}
            className={styles.logo}
          />
          <span className={styles.desktopLogoText}>EPICURE</span>
        </Link>
        <h1 className={styles.desktopHeaderTitle}>{COPY.checkout.pageTitle}</h1>
      </header>

      <div className={styles.desktopCardsRow}>
        <div className={styles.content}>
          <h2 className={styles.sectionTitle}>
            {COPY.checkout.deliveryDetailsTitle}
          </h2>
          <FloatingLabelInput
            label={COPY.checkout.fullNameLabel}
            value={fullName}
            onChange={setFullName}
            className={styles.field}
          />
          <FloatingLabelInput
            label={COPY.checkout.addressLabel}
            value={address}
            onChange={setAddress}
            className={styles.field}
          />
          <FloatingLabelInput
            label={COPY.checkout.phoneNumberLabel}
            type="tel"
            value={phoneNumber}
            onChange={setPhoneNumber}
            error={phoneError}
            className={styles.field}
          />

          <h2 className={styles.paymentSectionTitle}>
            {COPY.checkout.paymentDetailsTitle}
          </h2>
          <FloatingLabelInput
            label={COPY.checkout.cardNumberLabel}
            value={cardNumber}
            onChange={setCardNumber}
            error={cardNumberError}
            className={`${styles.field} ${styles.firstPaymentField}`}
          />
          <FloatingLabelInput
            label={COPY.checkout.nameOnCardLabel}
            value={nameOnCard}
            onChange={setNameOnCard}
            className={styles.field}
          />
          <FloatingLabelInput
            label={COPY.checkout.cvvLabel}
            type="tel"
            value={cvv}
            onChange={setCvv}
            error={cvvError}
            className={styles.field}
          />
          <FloatingLabelInput
            label={COPY.checkout.expiryDateLabel}
            type="tel"
            value={expiryDate}
            onChange={(value) => setExpiryDate(formatExpiryInput(value))}
            error={expiryError}
            className={styles.field}
          />

          {error && <p className={styles.error}>{error}</p>}
        </div>

        <div className={styles.desktopOrderCard}>
          <h2 className={styles.desktopOrderTitle}>{COPY.cart.desktopTitle}</h2>
          <div className={styles.desktopDishList}>
            {items.map((item) => {
              const description = lineDescription(item);
              const imageUrl = item.dish.image
                ? strapiUrl(item.dish.image.url)
                : null;
              return (
                <div key={item.id} className={styles.desktopDishRow}>
                  <div className={styles.imageWrapper}>
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={item.dish.image?.alternativeText ?? item.dish.name}
                        fill
                        className={styles.image}
                      />
                    ) : (
                      <div className={styles.imagePlaceholder} />
                    )}
                  </div>
                  <div className={styles.desktopDishInfo}>
                    <div className={styles.desktopTopRow}>
                      <div className={styles.desktopQuantityBox}>
                        {item.quantity}
                      </div>
                      <div className={styles.desktopNamePrice}>
                        <p className={styles.desktopDishName}>
                          {item.dish.name}
                        </p>
                        <p className={styles.desktopUnitPrice}>
                          {COPY.cart.unitPrice(item.dish.price)}
                        </p>
                      </div>
                    </div>
                    {description && (
                      <p className={styles.desktopOptionsRow}>{description}</p>
                    )}
                  </div>
                  <p className={styles.desktopTotalPrice}>
                    {COPY.cart.unitPrice(item.dish.price * item.quantity)}
                  </p>
                </div>
              );
            })}
          </div>

          <div className={styles.desktopCommentSection}>
            <div className={styles.desktopCommentDivider} />
            <p className={styles.desktopCommentTitle}>
              {COPY.cart.addCommentTitle}
            </p>
            <textarea
              className={styles.desktopCommentTextarea}
              placeholder={COPY.cart.commentPlaceholder}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          {error && <p className={styles.desktopError}>{error}</p>}

          <button
            type="button"
            className={
              isFormValid
                ? `${styles.payBtn} ${styles.payBtnValid}`
                : styles.payBtn
            }
            disabled={!isFormValid || isSubmitting}
            onClick={handleCompletePayment}
          >
            <span className={styles.payBtnLeft}>
              <LockIcon open={!isFormValid} />
              {COPY.checkout.payLabel}
            </span>
            <span>{COPY.cart.unitPrice(totalPrice)}</span>
          </button>
        </div>
      </div>

      <div className={styles.mobileOrderSummary}>
        <h2 className={styles.orderTitle}>{COPY.checkout.myOrderTitle}</h2>
        <div className={styles.dishList}>
          {items.map((item) => {
            const description = lineDescription(item);
            const imageUrl = item.dish.image
              ? strapiUrl(item.dish.image.url)
              : null;
            return (
              <div key={item.id} className={styles.dishCard}>
                <div className={styles.imageWrapper}>
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={item.dish.image?.alternativeText ?? item.dish.name}
                      fill
                      className={styles.image}
                    />
                  ) : (
                    <div className={styles.imagePlaceholder} />
                  )}
                </div>
                <div className={styles.dishInfo}>
                  <p className={styles.titleRow}>
                    <span className={styles.qtyX}>{item.quantity} x</span>{' '}
                    <span className={styles.dishName}>{item.dish.name}</span>
                  </p>
                  {description && (
                    <p className={styles.optionsRow}>{description}</p>
                  )}
                  <p className={styles.price}>
                    {COPY.dishDetail.shekelSign}
                    {item.dish.price * item.quantity}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.footer}>
        <p className={styles.totalRow}>
          {COPY.checkout.totalLabel(totalPrice)}
        </p>
        <button
          type="button"
          className={styles.completePaymentBtn}
          disabled={!isFormValid || isSubmitting}
          onClick={handleCompletePayment}
        >
          <Image
            src={isFormValid ? '/images/closelock.png' : '/images/openlock.png'}
            alt={COPY.checkout.completePaymentAlt}
            width={335}
            height={48}
          />
        </button>
      </div>
    </div>
  );
}
