# ⛵ Live Tracking — Regata de Vela

Dashboard interactivo que simula o acompanhamento em tempo real de uma regata de vela ao largo da costa portuguesa. O cenário é a etapa Cascais → Peniche, com 5 embarcações fictícias a competir no Atlântico.

**Demo ao vivo →** [carolinafloriano.github.io/live-tracking](https://carolinafloriano.github.io/live-tracking)

---

## O projecto

A ideia é recriar a experiência de acompanhar uma regata do sofá — o tipo de ecrã que se veria numa sala de imprensa ou no centro de operações de uma prova oceânica. Tudo actualiza a cada 3 segundos: posições, velocidades, classificação.

O mapa usa dados reais de cartografia (OpenStreetMap via CARTO) e as embarcações navegam em coordenadas geográficas verdadeiras, ao largo da costa de Lisboa. Cada barco tem rumo e velocidade próprios, com pequenas variações aleatórias que imitam o comportamento real do vento e da corrente — por isso a classificação pode mudar ao longo do tempo.

---

## O que se vê

**No mapa**
Cinco veleiros representados por marcadores triangulares que apontam na direcção de navegação de cada embarcação. À medida que se movem, deixam um rasto tracejado com o histórico de posições. A bandeira de chegada marca a linha de meta a noroeste, perto de Peniche.

**Na lista lateral**
A classificação actualiza em tempo real com a posição na corrida, velocidade em nós e distância restante até à meta de cada embarcação. A ordem pode mudar — quem vai mais rápido ou em melhor ângulo vai subindo.

**No painel de detalhe**
Ao clicar num barco — no mapa ou na lista — abre um painel com o nome do skipper, a equipa, as coordenadas actuais, e as últimas posições registadas com o respectivo horário. O mapa anima suavemente para centrar na embarcação seleccionada.

**O indicador LIVE**
Um ponto verde a pulsar no canto superior esquerdo e o timestamp da última actualização confirmam que os dados estão a ser recebidos.

---

Feito com React, Leaflet e CSS puro — sem API keys, sem frameworks pesadas.
