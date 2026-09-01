import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { cx } from '../../lib/css';
import { Display, Label } from '../../components/primitives/Text';
import { ROUTES } from '../../app/routes';
import { DotCanvas } from './DotCanvas';
import { FOOTER_COPYRIGHT, FOOTER_LINKS } from './copy';
import styles from './LandingClosure.module.css';

/**
 * THE CLOSING BLOCK.
 *
 * A window like the nav: inset from both sides, cut at the window
 * radius, with the tactile dot field drawn across it and two things
 * standing on top — the line the visitor leaves with, and the way
 * in. Nothing else. The paragraph that used to sit between them was
 * explaining a sentence that does not need explaining.
 *
 * IT OPENS AS IT ARRIVES. The container comes up from just under
 * full size as it enters the window, on the firm curve with no
 * overshoot in it — a reveal, not a pop. It is an
 * IntersectionObserver and a CSS transition rather than a
 * scroll-driven scale, because the block is shorter than the window
 * and there is no pinned travel to read a progress value from: the
 * honest signal here is "it is on screen", and that is a boolean.
 *
 * The field reacts to the cursor and the words do not — the block
 * takes the pointer, and the content sitting on it opts back out —
 * so moving across the block disturbs the surface around the type
 * rather than the type itself.
 *
 * THE PAGE ENDS HERE, AND THE FOOTER IS INSIDE IT. There is no
 * strip under the container — the last thing on the page is its
 * bottom edge. The ways to reach us and the copyright line sit
 * within the block, under the call to action, in the annotation
 * voice: a footer outside it would have been a second band of page
 * after the page had already finished.
 */
export function LandingClosure() {
  const block = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const el = block.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        /* one way only. It opens when it arrives and stays open —
           a container that closed again on the way out would be
           animating behind the reader's back. */
        if (entry.isIntersecting) setOpen(true);
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section} data-section="closure">
      <div ref={block} className={cx(styles.block, open && styles.open)}>
        <DotCanvas />

        <div className={styles.content}>
          {/* THE LINE AND THE WAY IN, as one group: they take the
              block and centre in whatever the footer leaves. The
              footer is the block's other group and stands on its
              bottom padding — see the stylesheet. */}
          <div className={styles.lead}>
            <Display size="xl" as="p" className={styles.line}>
              Built to be outgrown.
            </Display>

            <Link to={ROUTES.home} className={styles.cta}>
              <Label tone="inherit">Open the prototype</Label>
            </Link>
          </div>

          {/* THE FOOTER, INSIDE THE BLOCK.

              Mono, small, muted and widely tracked — the annotation
              voice the whole product uses for anything that is
              machinery rather than content. The links shift colour
              on hover and do nothing else: an underline appearing
              under four items in a row is four things moving to
              acknowledge one pointer. */}
          <div className={styles.footer}>
            <ul className={styles.links}>
              {FOOTER_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    className={styles.link}
                    href={link.href}
                    /* the three that leave the site say so; the one
                       that does not is an internal route */
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                  >
                    <Label tone="inherit">{link.label}</Label>
                  </a>
                </li>
              ))}
            </ul>

            <p className={styles.meta}>
              <Label tone="inherit">{FOOTER_COPYRIGHT}</Label>
              <Label tone="inherit">build {__AERA_BUILD__}</Label>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
