import { motion } from "framer-motion";
import { Target, Eye, Heart } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5 },
  }),
};

const AboutPage = () => {
  return (
    <div className="section-container py-24">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={0}
        className="mx-auto max-w-3xl text-center"
      >
        <h1 className="font-display text-4xl font-bold text-foreground sm:text-5xl">
          Sobre <span className="gradient-text">Por un amigo fiel</span>
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          La historia de Por un Amigo Fiel – Píllaro nació hace muchos años, cuando Valeria y Nataly rescataban perritos de manera silenciosa con el apoyo de su familia. No había cámaras ni una organización formal, solo sensibilidad, empatía y la convicción de que ningún animal debía sufrir solo.

El primer antecedente visible de esta labor llegó en 2019, cuando Valeria Pozo Viera, en calidad de Reina de la Universidad Católica sede Ambato, organizó un evento de adopción junto a fundaciones de rescate animal de Ambato. En ese espacio apareció por primera vez el nombre “Por un Amigo Fiel”, en un momento en que Píllaro aún no contaba con una organización dedicada formalmente al bienestar animal.

El 05 de mayo de 2020, en medio de la pandemia, la iniciativa se dio a conocer públicamente, en respuesta al incremento del abandono animal. Así nació públicamente Por un Amigo Fiel – Píllaro, con trabajo voluntario, fondos propios y el apoyo solidario de personas comprometidas con esta causa.

En este camino también se sumó Diana, aportando con el mismo compromiso y amor por los animalitos. Con el tiempo, más voluntarios y personas solidarias se han unido, fortaleciendo esta labor construida con esfuerzo, entrega y corazón.

Hoy, aunque cuenta con reconocimiento oficial como fundación, Por un Amigo Fiel – Píllaro mantiene intacta su esencia: trabajar con amor, empatía y compromiso por quienes no tienen voz, pero sí sienten y merecen una oportunidad.  
        </p>
      </motion.div>

      <div className="mt-20 grid gap-8 md:grid-cols-2">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={1}
          className="card-pet p-8"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Target className="h-7 w-7 text-primary" />
          </div>
          <h2 className="mt-5 font-display text-2xl font-bold text-foreground">Misión</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Promover el bienestar animal en el cantón Píllaro mediante acciones sostenibles de rescate, esterilización, adopción y educación ciudadana, fomentando la tenencia responsable y contribuyendo a la reducción del abandono y la sobrepoblación de fauna urbana en la comunidad pillareña
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={2}
          className="card-pet p-8"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/10">
            <Eye className="h-7 w-7 text-secondary" />
          </div>
          <h2 className="mt-5 font-display text-2xl font-bold text-foreground">Visión</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Ser una organización referente a nivel nacional en la protección animal, reconocida por su impacto social, su compromiso con la comunidad y su capacidad de generar una cultura de respeto, cuidado y responsabilidad hacia los animales.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        custom={3}
        className="mx-auto mt-20 max-w-3xl text-center"
      >
        <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-primary/10">
          <Heart className="h-7 w-7 text-primary" />
        </div>
        <h2 className="mt-5 font-display text-2xl font-bold text-foreground">Nuestros Valores</h2>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[ "Responsabilidad Social", "Ética", "Honestidad"].map((value) => (
            <div key={value} className="rounded-xl bg-muted p-4">
              <p className="text-sm font-semibold text-foreground">{value}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AboutPage;
