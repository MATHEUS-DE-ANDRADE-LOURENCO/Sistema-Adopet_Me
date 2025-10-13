import React from "react";
import {MapPin, Bone, Heart, ArrowRight} from "lucide-react";

const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: "1°",
      title: "Busque Ongs",
      description: "Explore ONGs de adoção próximas a você.",
      icon: MapPin,
      iconColor: "text-amber-700",
      bgColor: "bg-amber-100",
    },
    {
      number: "2°",
      title: "Conheça os pets",
      description: "Veja os animais disponíveis para adoção com fotos e informações.",
      icon: Bone,
      iconColor: "text-stone-700",
      bgColor: "bg-amber-100",
    },
    {
      number: "3°",
      title: "Adopet!",
      description: "Entre em contato com a ONG e dê um lar cheio de amor.",
      icon: Heart,
      iconColor: "text-red-600 fill-red-600",
      bgColor: "bg-amber-100",
    },
  ];

  return (
    <section className="py-20 bg-white/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-extrabold text-neutral-950 text-center mb-16">
          Como funciona o adopet.me?
        </h2>

        <div className="relative flex flex-col md:flex-row justify-between items-start md:space-x-8">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className="flex-1 text-center mb-10 md:mb-0">
                <p className="text-2xl font-bold text-neutral-950 mb-4">
                  {step.number} {step.title}
                </p>
                <div className={`mx-auto w-24 h-24 ${step.bgColor} rounded-full flex items-center justify-center mb-6 shadow-lg`}>
                  <step.icon className={`w-10 h-10 ${step.iconColor}`} />
                </div>
                <p className="text-lg text-neutral-900 px-4">
                  {step.description.split(' ').map((word, i) => (
                    <span key={i} className={['ONGs', 'você', 'adoção', 'ONG', 'amor'].includes(word.replace(/[.,]/g, '')) ? 'font-bold text-stone-800' : ''}>
                      {word}{' '}
                    </span>
                  ))}
                </p>
              </div>

              {/* Seta de Conexão */}
              {index < steps.length - 1 && (
                <div className="hidden md:flex items-center justify-center h-24 my-auto relative">
                  <ArrowRight className="w-8 h-8 text-amber-800" />
                </div>
              )}
              
              {/* Seta de Conexão */}
              {index < steps.length - 1 && (
                <div className="flex md:hidden justify-center my-4 w-full">
                  <ArrowRight className="w-6 h-6 text-amber-600 transform rotate-90" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};
export default HowItWorksSection;