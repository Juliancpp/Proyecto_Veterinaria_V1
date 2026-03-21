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
          Sobre <span className="gradient-text">PatitasHome</span>
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          Somos una fundación dedicada al rescate, rehabilitación y adopción responsable de animales
          en situación de vulnerabilidad. Creemos que cada ser vivo merece amor, respeto y un hogar seguro.
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
            Rescatar, rehabilitar y encontrar hogares responsables para animales abandonados, promoviendo
            la tenencia responsable y el respeto por la vida animal a través de la educación y la acción comunitaria.
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
            Ser la fundación referente en Latinoamérica en adopción animal responsable, construyendo
            una sociedad donde ningún animal viva en las calles y cada mascota tenga un hogar digno.
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
          {["Compasión", "Responsabilidad", "Transparencia", "Comunidad"].map((value) => (
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
