import { CommonModule } from "@angular/common";
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { VideoFullscreenDirective } from "../video-fullscreen.directive";
import { FormsModule } from "@angular/forms";
import { VideoStreamService } from "../service/VideoStream.service";
import { VideoQuality } from "../domain/video-quality.interface";
import { VideoQualityService } from "../service/video-quality.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-video-player",
  standalone: true,
  imports: [CommonModule, FormsModule, VideoFullscreenDirective],
  templateUrl: "./video-player.component.html",
  styleUrl: "./video-player.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoPlayerComponent implements AfterViewInit, OnChanges {
  @ViewChild("videoPlayer") videoPlayer!: ElementRef<HTMLVideoElement>;
  @ViewChild("videoCanvas") videoCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild("progressBar") progressBar!: ElementRef<HTMLDivElement>;

  @Input() videoUrl: string = '';
  @Input() videoId: string = '';

  isPlaying: boolean = false;
  isMuted: boolean = false;
  areControlsVisible: boolean = true;
  isFullscreen: boolean = false;
  volume: number = 1;
  previousVolume: number = 1;
  isQualityMenuVisible: boolean = false;

  isControlsVisible: boolean = true;
  private controlsTimeout: any;
  private isMouseMoving: boolean = false;
  private readonly HIDE_DELAY = 3000; // 3 segundos.

  // Propiedades para el progreso.
  loadedProgress: number = 0;
  currentProgress: number = 0;
  previewPosition: number = 0;
  isPreviewVisible: boolean = false;
  previewTime: number = 0;
  currentTime: number = 0;
  duration: number = 0;
  thumbnailsLoaded: boolean = false;

  private isInitialized: boolean = false;

  private subscription: Subscription[] = [];


  constructor(private videoStreamService: VideoStreamService, private qualityService: VideoQualityService) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['videoId'] && changes['videoId'].currentValue) {
      this.loadVideoQualities();
    }
  }

  private loadVideoQualities(): void {
    // Cargar calidades disponibles para este video.
    this.qualities = this.qualityService.filterQualities(this.videoId);

    // Seleccionar calidad inicial
    if (this.isAutoQuality) {
      this.toggleAutoQuality();
    } else {
      // Intentar mantener la misma calidad que estaba seleccionada.
      const previousQuality = this.currentQuality?.label;
      if (previousQuality) {
        const sameQuality = this.qualities.find((q) => q.label === previousQuality);
        if (sameQuality) {
          this.changeQuality(sameQuality);
        } else {
          // Si no existe la misma calidad, usar la mejor disponible.
          this.changeQuality(this.qualities[0]);
        }
      } else {
        this.changeQuality(this.qualities[0]);
      }
    }
  }
  ngAfterViewInit(): void {
    this.startVideoPlayback();
    if (this.videoPlayer && this.videoPlayer.nativeElement) {
      this.initializeVideoEvents();
    }
  }
  ngOnInit(): void {
    if (this.videoPlayer) {
      this.videoStreamService.initializeStream(
        this.videoPlayer.nativeElement,
        this.videoUrl
      );
    }

    this.subscription.push(
      this.qualityService.getCurrentQuality().subscribe((quality) => {
        this.currentQuality = quality;
        this.updateVideoSource();
      }),

      this.qualityService.getIsAutoQuality().subscribe((isAuto) => {
        this.isAutoQuality = isAuto;
      })
    );

    this.loadQualityPreference();

    // Monitorear el ancho de banda.
    this.startBandwidthMonitoring();
  }

  private ctx!: CanvasRenderingContext2D;
  private animationFrameId!: number;

  currentQuality?: VideoQuality;
  isAutoQuality: boolean = true;
  isChangingQuality: boolean = false;

  qualities: VideoQuality[] = [];

  // Detectar movimiento del mouse en el contenedor.
  @HostListener("mousemove")
  onMouseMove() {
    this.showControls();
    this.resetHideControlsTimer();
  }

  // Detectar cuando del mouse en el contenedor.
  @HostListener("mousemove")
  onMouseLeave() {
    if (this.isPlaying) {
      this.hideControls();
    }
  }

  private startVideoPlayback() {
    const video = this.videoPlayer.nativeElement;

    // Comenzar a dibujar frames cuando el video esté listo.
    video.onloadeddata = () => {
      this.drawFrame();
    };
  }

  private drawFrame() {
    if (!this.isInitialized || !this.ctx || !this.videoPlayer?.nativeElement) {
      return;
    }
    const video = this.videoPlayer.nativeElement;
    const canvas = this.videoCanvas.nativeElement;

    if (!video.paused && !video.ended) {
      // Limpiar el canvas.
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Aplicar configuración de calidad.
      this.ctx.imageSmoothingEnabled = true;
      this.ctx.imageSmoothingQuality = "high";

      // Dibujar frame con la escala actual.
      this.ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      this.animationFrameId = requestAnimationFrame(() => this.drawFrame());
    }
  }

  // Cambiar volumen (Desde el control deslizante).
  changeVolume(event: Event) {
    if (!this.videoPlayer?.nativeElement) return;

    const video = this.videoPlayer.nativeElement;
    const value = (event.target as HTMLInputElement).value;

    // Convertir el valor a número y asegurarse de que esté  entre 0 y 1.
    this.volume = Number(value);
    video.muted = this.isMuted;
  }

  async changeQuality(quality: VideoQuality) {
    if (!this.videoPlayer?.nativeElement) return;
    const video = this.videoPlayer.nativeElement;
    const wasPlaying = !video.paused;

    try {
      await this.qualityService.setQuality(quality);
      if (wasPlaying) {
        await video.play();
      }
    } catch (error) {
      console.error("Error al cambiar la calidad:", error);
    }
  }

  toggleAutoQuality() {
    this.qualityService.setAutoQuality(!this.isAutoQuality);
  }

  private updateVideoSource() {
    if (!this.currentQuality || !this.videoPlayer) return;

    const video = this.videoPlayer.nativeElement;
    const currentTime = video.currentTime;
    const wasPlaying = !video.paused;

    if (video.id === this.currentQuality.id) {
      video.src = this.currentQuality.src;

      video.addEventListener(
        'loadedmetadata',
        () => {
          video.currentTime = currentTime;
          if (wasPlaying) {
            video.play();
          }
        },
        { once: true }
      );
    }
  }


  private startBandwidthMonitoring() {
    if ('connection' in navigator && 'downlink' in (navigator as any).connection) {
      const connection = (navigator as any).connection;

      const updateBandwidth = () => {
        this.qualityService.updateBandwidth(connection.downlink * 1000000); // Convertir Mbps a bps
      }

      connection.addEventListener('change', updateBandwidth);
      updateBandwidth(); // Initial check
    }
  }

  setAutoQuality() {
    this.isAutoQuality = true;
    this.isQualityMenuVisible = false;
  }

  ngOnDestroy(): void {
    this.videoStreamService.destroy();
    if (!this.isInitialized) {
      clearTimeout(this.controlsTimeout);
    }

    // Limpiar timeout y eventos
    if (this.controlsTimeout) {
      clearTimeout(this.controlsTimeout);
    }

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    this.subscription.forEach((sub) => sub.unsubscribe());
  }

  // Método para reproducir/pausar el video.
  togglePlay(): void {
    if (!this.videoPlayer?.nativeElement) return;

    const video = this.videoPlayer.nativeElement;

    if (video.paused) {
      video
        .play()
        .then(() => {
          this.isPlaying = true;
        })
        .catch((error) => {
          console.error("Error al reproducir el video:", error);
        });
    } else {
      video.pause();
      this.isPlaying = false;
    }
  }

  // Mostrar controles.
  showControls(): void {
    this.areControlsVisible = true;
    this.isControlsVisible = true;
    document.body.style.cursor = "default";
    // Limpiar el timeout existente si hay uno.
    if (this.controlsTimeout) {
      clearTimeout(this.controlsTimeout);
    }

    // Configurar nuevo timeout para ocultar los controles.
    this.controlsTimeout = setTimeout(() => {
      if (this.isPlaying) {
        this.hideControls();
      }
    }, 3000);
  }

  // Ocultar controles.
  hideControls(): void {
    if (!this.isMouseMoving && this.isPlaying) {
      this.isControlsVisible = false;
      document.body.style.cursor = "none";
    }
    // No ocultar si el menú de calidad está abierto
    if (this.isQualityMenuVisible) {
      return;
    }

    // No ocultar si el video está pausado
    if (!this.isPlaying) {
      return;
    }

    this.areControlsVisible = false;
  }

  // Reiniciar el temporizador para ocultar los controles.
  private resetHideControlsTimer() {
    if (this.controlsTimeout) {
      clearTimeout(this.controlsTimeout);
    }

    if (this.isPlaying) {
      this.controlsTimeout = setTimeout(() => {
        this.hideControls();
      }, this.HIDE_DELAY);
    }
  }

  @HostListener("document:mousemove")
  onGlobalMouseMove() {
    let timeout: any;
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      this.isMouseMoving = false;
    }, 1000);
  }

  // Mantener controles visibles durante interacciones
  onControlsInteraction() {
    this.isMouseMoving = true;
    this.showControls();
    clearTimeout(this.controlsTimeout);
  }

  // Finalizar interacción con controles
  onControlsInteractionEnd() {
    this.isMouseMoving = false;
    this.resetHideControlsTimer();
  }

  //Ocultar la vista previa.
  hideTimePreview() {
    this.isPreviewVisible = false;
  }

  //! Actualizar la vista previa al mover el mouse sobre de progreso.
  updateTimePreview(event: MouseEvent) {
    if (!this.progressBar?.nativeElement) return;

    const progressBar = this.progressBar.nativeElement;
    const rect = progressBar.getBoundingClientRect();
    const position = (event.clientX - rect.left) / rect.width;

    // Calcular tiempo y posición.
    this.previewTime = position * this.duration;
    this.previewPosition = position * 100;
    this.isPreviewVisible = true;

    // Opcional: Generar thumbnails en la posición actual.
    this.generateThumbnail(this.previewTime);
  }

  // Generar thumbnail para la vista previa.
  private generateThumbnail(time: number) {
    if (!this.videoPlayer?.nativeElement) return;

    const video = this.videoPlayer.nativeElement;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;

    if (!context) return;

    // Configurar dimensiones del canvas.
    canvas.width = 160; // Ancho del thumbnail.
    canvas.height = 90; // Alto del thumbnail (16:9)

    // Guardar tiempo para el thumbnail.
    const currentTime = video.currentTime;

    // Cuando el video para el thumbnail.
    video.currentTime = time;

    // Cuando el video llegue al tiempo deseado.
    video.addEventListener(
      "seeked",
      () => {
        // Dibujar el frame actual en el canvas.
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Restaurar tiempo original.
        video.currentTime = currentTime;
      },
      { once: true }
    );
  }

  // Alternar silencio
  toggleMute(): void {
    if (!this.videoPlayer?.nativeElement) return;
    const video = this.videoPlayer.nativeElement;

    if (this.isMuted) {
      // Restaurar volumen anterior.
      this.volume = this.previousVolume;
      video.volume = this.volume;
      video.muted = false;
    } else {
      // Guardar volumen actual antes de mutear.
      this.previousVolume = this.volume;
      this.volume = 0;
      video.volume = 0;
      video.muted = true;
    }

    this.isMuted = !this.isMuted;
  }

  // Alterar menú de calidad
  toggleQualityMenu(): void {
    this.isQualityMenuVisible = !this.isQualityMenuVisible;
  }

  // Alterar pantalla completa.
  toggleFullscreen(): void {
    const videoContainer = this.videoPlayer.nativeElement.parentElement;

    if (!document.fullscreenElement) {
      // Entrar en pantalla completa
      if (videoContainer?.requestFullscreen) {
        videoContainer.requestFullscreen();
      }
      this.isFullscreen = true;
    } else {
      // Salir de pantalla completa
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      this.isFullscreen = false;
    }
  }

  // Manejado de eventos de teclado
  @HostListener("document:keydown", ["$event"])
  handleKeyboardEvent(event: KeyboardEvent): void {
    switch (event.key.toLowerCase()) {
      case " ":
      case "k":
        event.preventDefault();
        this.togglePlay();
        break;
      case "m":
        this.toggleMute();
        break;
      case "f":
        this.toggleFullscreen();
        break;
      case "escape":
        if (this.isQualityMenuVisible) {
          this.isQualityMenuVisible = false;
        }
        break;
    }
  }

  // Manejador de eventos de pantalla completa
  @HostListener("document:fullscreenchange", ["$event"])
  @HostListener("document:webkitfullscreenchange", ["$event"])
  @HostListener("document:mozfullscreenchange", ["$event"])
  @HostListener("document:MSFullscreenChange", ["$event"])
  onFullscreenChange(): void {
    this.isFullscreen = !!document.fullscreenElement;
  }

  private initializeVideoEvents(): void {
    if (!this.videoPlayer?.nativeElement || !this.videoCanvas?.nativeElement) {
      console.error("Elementos de video no encontrados");
      return;
    }

    const video = this.videoPlayer.nativeElement;
    const canvas = this.videoCanvas.nativeElement;

    // Inicializar el contexto del canvas.
    this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    if (!this.ctx) {
      console.error("No se pudo obtener el context del canvas.");
      return;
    }

    video.addEventListener("play", () => {
      this.isPlaying = true;
      this.drawFrame();
    });

    video.addEventListener("pause", () => {
      this.isPlaying = false;
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
      }
    });

    // Actualizar tiempo actual y duración.
    video.addEventListener("timeupdate", () => {
      this.currentTime = video.currentTime;
      this.currentProgress = (this.currentTime / this.duration) * 100;
    });

    // Evento cuando termina al video.
    video.addEventListener("ended", () => {
      this.isPlaying = false;
      this.showControls();
    });

    // Actualizar duración cuando se carga el metadata.
    video.addEventListener("loadedmetadata", () => {
      this.duration = video.duration;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      this.isInitialized = true;
      this.showControls();
    });

    // Actualizar progreso de carga.
    video.addEventListener("progress", () => {
      if (video.buffered.length > 0) {
        this.loadedProgress =
          (video.buffered.end(video.buffered.length - 1) / this.duration) * 100;
      }
    });

    // Eventos de error
    video.addEventListener("error", (e) => {
      console.error("Error en el video:", e);
      this.isPlaying = false;
      this.showControls();
    });
  }

  // Método para actualizar la posición de preview.
  updatePreviewPosition(event: MouseEvent): void {
    const progressBar = event.currentTarget as HTMLElement;
    const rect = progressBar.getBoundingClientRect();
    const position = (event.clientX - rect.left) / rect.width;

    this.previewPosition = position * 100;
    this.previewTime = position * this.duration;
  }

  // Método para buscar en el video.
  seek(event: MouseEvent): void {
    if (!this.progressBar?.nativeElement || !this.videoPlayer?.nativeElement)
      return;

    const progressBar = this.progressBar.nativeElement;
    const video = this.videoPlayer.nativeElement;
    const rect = progressBar.getBoundingClientRect();
    const position = (event.clientX - rect.left) / rect.width;

    video.currentTime = position * this.duration;
  }

  transform(value: number): string {
    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  private loadQualityPreference(): void {
    const saved = localStorage.getItem('preferredQuality');
    if (saved) {
      const { label, isAuto } = JSON.parse(saved);
      if (isAuto) {
        this.toggleAutoQuality();
      } else {
        const quality = this.qualities.find((q) => q.label === label);
        if (quality) {
          this.changeQuality(quality);
        }
      }
    }
  }
}
